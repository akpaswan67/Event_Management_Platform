const Event = require('../models/Event');
const mongoose = require('mongoose');

const createEvent = async (req, res) => {
  try {
    const { name, description, date, location, attendees } = req.body;

    const newEvent = await Event.create({
      name,
      description,
      date,
	  location,
      attendees,
      user: req.user.id,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an event by ID
const getEventById = async (req, res) => {
	try {
	  const { id } = req.params;
  
	  // Validate Event ID
	  if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'Invalid event ID' });
	  }
  
	  // Fetch event with ownership check
	//   console.log('Event ID:', id); // Debugging log
	//   console.log('User ID:', req.user.id); // Debugging log
  
	  const event = await Event.findOne({ _id: id, user: req.user.id });
  
	  if (!event) {
		return res.status(404).json({ message: 'Event not found or not authorized' });
	  }
  
	  res.status(200).json(event);
	} catch (error) {
	  console.error('Error fetching event:', error); // Debugging log
	  res.status(500).json({ message: 'Server error', error });
	}
  };

// Update an event
const updateEvent = async (req, res) => {
	try {
	  const { id } = req.params; // Get event ID from URL params
	  const { name, description, date, location, attendees } = req.body; // Get updated data from request body
  
	  // Validate Event ID
	  if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'Invalid event ID' });
	  }
  
	  // Update the event if it belongs to the authenticated user
	  const event = await Event.findOneAndUpdate(
		{ _id: id, user: req.user.id }, // Ownership check
		{ name, description, date, location, attendees }, // Updated fields
		{ new: true } // Return the updated event
	  );
  
	  if (!event) {
		return res.status(404).json({ message: 'Event not found or not authorized' });
	  }
  
	  res.status(200).json(event);
	} catch (error) {
	  console.error('Error updating event:', error); // Debugging log
	  res.status(500).json({ message: 'Server error', error });
	}
  };
  
  // Delete an event
  const deleteEvent = async (req, res) => {
	try {
	  const { id } = req.params; // Get event ID from URL params
  
	  // Find and delete the event if it belongs to the authenticated user
	  const event = await Event.findOneAndDelete({ _id: id, user: req.user.id });
  
	  if (!event) {
		return res.status(404).json({ message: 'Event not found or not authorized' });
	  }
  
	  res.status(200).json({ message: 'Event deleted successfully' });
	} catch (error) {
	  res.status(500).json({ message: 'Server error', error });
	}
  };
  
  module.exports = {
	createEvent,
	getEvents,
	getEventById,
	updateEvent,
	deleteEvent
  };
