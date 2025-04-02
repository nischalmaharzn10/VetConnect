import Appointment from '../models/Appointment.js';

// ✅ Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { userId, vetId, appointmentDate, scheduledTime } = req.body;

    // ✅ Error Handling - Check if required fields exist
    if (!userId || !vetId || !appointmentDate || !scheduledTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Convert date properly
    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // ✅ Create the appointment
    const newAppointment = new Appointment({
      userId,
      vetId,
      appointmentDate: parsedDate,
      scheduledTime,
      // status: "pending",
    });

    const savedAppointment = await newAppointment.save();
    return res.status(201).json({ message: "Appointment created successfully.", appointment: savedAppointment });

  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    return res.status(500).json({ message: "Server error. Could not create appointment." });
  }
};

// ✅ Get all appointments for a user
export const getAppointmentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const appointments = await Appointment.find({ userId });

    if (!appointments.length) {
      return res.status(404).json({ message: "No appointments found." });
    }

    return res.status(200).json({ appointments });

  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return res.status(500).json({ message: "Server error. Could not fetch appointments." });
  }
};

// ✅ Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    if (!appointmentId || !status) {
      return res.status(400).json({ message: "Appointment ID and status are required." });
    }

    if (!['pending', 'scheduled', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    return res.status(200).json({ message: "Appointment status updated successfully.", appointment: updatedAppointment });

  } catch (error) {
    console.error("❌ Error updating appointment status:", error);
    return res.status(500).json({ message: "Server error. Could not update appointment status." });
  }
};