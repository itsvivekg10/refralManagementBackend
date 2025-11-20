const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidates');
const upload = require('../middleware/upload');
const { validateCandidate } = require('../validators/candidateValidator');

// POST /api/candidates
// multipart/form-data expected if resume is included (field name: resume)
router.post('/', upload.single('resume'), validateCandidate, async (req, res, next) => {
  try {
    const { name, email, phone, jobTitle } = req.body;

    // prepare resumeUrl if file was uploaded
    let resumeUrl = null;
    if (req.file) {
      // Build public URL using BASE_URL env var if present
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      resumeUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const candidate = new Candidate({
      name,
      email,
      phone,
      jobTitle,
      resumeUrl
    });

    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    // multer file filter error will come here
    next(err);
  }
});

// GET /api/candidates
// optional query params: status, jobTitle, search (searches name or jobTitle)
router.get('/', async (req, res, next) => {
  try {
    const { status, jobTitle, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (jobTitle) filter.jobTitle = new RegExp(jobTitle, 'i');
    if (search) {
      const s = new RegExp(search, 'i');
      filter.$or = [{ name: s }, { jobTitle: s }, { email: s }];
    }

    const candidates = await Candidate.find(filter).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    next(err);
  }
});

// PUT /api/candidates/:id/status
// body: { status: "Reviewed" }  (allowed: Pending, Reviewed, Hired)
router.put('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending', 'Reviewed', 'Hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    candidate.status = status;
    await candidate.save();
    res.json(candidate);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/candidates/:id
// optional - deletes candidate record (does not delete physical resume file)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted', candidate });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
