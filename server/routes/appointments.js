const express = require('express')
const router = express.Router()
const Appointment = require('../models/Appointment')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    let appointments

    if (req.user.role === 'admin') {
      appointments = await Appointment.find()
        .populate('patient', 'name email phone')
        .sort({ createdAt: -1 })
    } else {
      appointments = await Appointment.find({ patient: req.user.id }).sort({
        createdAt: -1,
      })
    }

    res.json(appointments)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments.' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { service, doctor, date, time, notes, patientId } = req.body

    if (!service || !doctor || !date || !time) {
      return res.status(400).json({ message: 'Service, doctor, date and time are required.' })
    }

    let assignedPatient = req.user.id

    if (req.user.role === 'admin') {
      if (!patientId) {
        return res.status(400).json({ message: 'Please select a patient.' })
      }
      assignedPatient = patientId
    }

    const appointment = await Appointment.create({
      patient: assignedPatient,
      service,
      doctor,
      date,
      time,
      notes,
    })

    res.status(201).json(appointment)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create appointment.' })
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' })
    }

    if (
      req.user.role !== 'admin' &&
      appointment.patient.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized.' })
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update appointment.' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' })
    }

    if (
      req.user.role !== 'admin' &&
      appointment.patient.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized.' })
    }

    await Appointment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Appointment deleted.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete appointment.' })
  }
})

module.exports = router
