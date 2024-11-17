const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL 
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to verify API key
// Middleware to verify API key
const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const projectId = req.headers['x-project-id'];
  console.log('Verifying:', { apiKey, projectId });

  if (!apiKey || !projectId) {
    return res.status(401).json({ error: 'Missing API key or project ID' });
  }

  try {
    // First verify if the API key exists and is active
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('project_id, key_type, is_active')
      .eq('key_value', apiKey)
      .eq('is_active', true)
      .single();

    if (keyError || !keyData) {
      console.error('API key verification failed:', keyError);
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Then verify if the API key belongs to the specified project
    if (keyData.project_id !== projectId) {
      console.error('Project ID mismatch');
      return res.status(401).json({ error: 'API key does not match project' });
    }

    // Update last_used_at timestamp
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key_value', apiKey);

    if (updateError) {
      console.error('Failed to update last_used_at:', updateError);
    }

    // Add key type to request for potential future use
    req.projectId = projectId;
    req.keyType = keyData.key_type;
    next();
  } catch (err) {
    console.error('Authentication failed:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Track error endpoint
app.post('/api/track', verifyApiKey, async (req, res) => {
  try {
    const errorEvent = req.body;
    console.log('Tracking error:', errorEvent);
    
    const { error } = await supabase.from("errors").insert([{
      project_id: req.projectId,
      message: errorEvent.message,
      type: errorEvent.type,
      stack_trace: errorEvent.stack,
      browser: errorEvent.browser?.name,
      os: errorEvent.os?.name,
      severity: errorEvent.severity || "error",
      status: 'open'
    }]);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error('Error tracking failed:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to track error' 
    });
  }
});


// Get project errors endpoint
app.get('/api/errors/:projectId', verifyApiKey, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('errors')
      .select('*')
      .eq('project_id', req.projectId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Transform the data to match ErrorEvent interface
    const errors = data.map(error => ({
      message: error.message,
      type: error.type,
      stack: error.stack_trace,
      browser: error.browser ? {
        name: error.browser,
        version: ''  // We don't store version in DB
      } : undefined,
      os: error.os ? {
        name: error.os,
        version: ''  // We don't store version in DB
      } : undefined,
      severity: error.severity,
      status: error.status,
      created_at: error.created_at
    }));

    res.json({ 
      success: true,
      data: errors 
    });
  } catch (err) {
    console.error('Error fetching failed:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch errors' 
    });
  }
});

// Update error status endpoint
app.patch('/api/errors/:errorId/status', verifyApiKey, async (req, res) => {
  const { errorId } = req.params;
  const { status } = req.body;

  if (!['open', 'resolved', 'ignored'].includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status. Must be one of: open, resolved, ignored'
    });
  }

  try {
    const { error } = await supabase
      .from('errors')
      .update({ status })
      .eq('id', errorId)
      .eq('project_id', req.projectId);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error('Error status update failed:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update error status'
    });
  }
});

app.listen(port, () => {
  console.log(`Error tracking server running on port ${port}`);
});