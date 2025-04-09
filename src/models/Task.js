const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Por favor ingrese un título"],
    trim: true,
    maxlength: [100, "El título no puede tener más de 100 caracteres"]
  },
  description: {
    type: String,
    required: [true, "Por favor ingrese una descripción"],
    trim: true
  },
  status: {
    type: String,
    enum: ["pendiente", "en progreso", "completada"],
    default: "pendiente"
  },
  dueDate: {
    type: Date,
    required: [true, "Por favor ingrese una fecha límite"]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", TaskSchema);
