const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// @route   GET api/employees
// @desc    Get all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/employees/search
// @desc    Search employees
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        const employees = await Employee.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { type: { $regex: q, $options: 'i' } }
            ]
        });
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/employees/:id
// @desc    Get employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/employees
// @desc    Create an employee
router.post('/', upload.single('profilePic'), async (req, res) => {
    try {
        const { name, email, phone, department, type } = req.body;
        
        const newEmployee = new Employee({
            name,
            email,
            phone,
            department,
            type,
            profilePic: req.file ? req.file.path : ''
        });

        const employee = await newEmployee.save();
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/employees/:id
// @desc    Update employee
router.put('/:id', upload.single('profilePic'), async (req, res) => {
    try {
        const { name, email, phone, department, type } = req.body;
        
        let employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        const updateFields = {
            name,
            email,
            phone,
            department,
            type
        };

        if (req.file) {
            updateFields.profilePic = req.file.path;
        }

        employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/employees/:id
// @desc    Delete employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        await employee.remove();
        res.json({ msg: 'Employee removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 