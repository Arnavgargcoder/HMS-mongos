require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------------- DB CONNECTION ---------------------- */
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

/* ---------------------- Mongoose Models ---------------------- */
const managerSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  photo: { type: Buffer },
  pwd: { type: String, required: true },
});
const Manager = mongoose.model('Manager', managerSchema);

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  carmodel: { type: String, required: true },
  carnumber: { type: String, required: true },
  availability: { type: String, required: true },
  cumid: { type: String, default: null },
});
const Driver = mongoose.model('Driver', driverSchema);

const roomSchema = new mongoose.Schema({
  roomnumber: { type: String, required: true, unique: true },
  bedtype: { type: String, required: true },
  roomcondition: { type: String, required: true },
  availability: { type: String, required: true },
  price: { type: Number, required: true },
});
const Room = mongoose.model('Room', roomSchema);

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  job: { type: String, required: true },
  salary: { type: Number, required: true },
});
const Employee = mongoose.model('Employee', employeeSchema);

const customerSchema = new mongoose.Schema({
  identityType: { type: String, required: true },
  identityNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  checkInTime: { type: String, required: true },
  bedtype: { type: String, required: true },
  roomnumber: { type: String, required: true },
  amount: { type: Number, required: true },
});
const Customer = mongoose.model('Customer', customerSchema);

/* ---------------------- MULTER ---------------------- */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ---------------------- AUTH ROUTES ---------------------- */

// Signup route
app.post('/signup', upload.single('photo'), async (req, res) => {
  try {
    const { uid, name, gender, pwd } = req.body;
    if (!uid || !name || !gender || !pwd || !req.file) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingManager = await Manager.findOne({ uid });
    if (existingManager) {
      return res.status(409).json({ message: 'UID already exists' });
    }

    const photoBuffer = await sharp(req.file.buffer)
      .resize({ width: 300 })
      .jpeg({ quality: 90 })
      .toBuffer();
    const hashedPassword = await bcrypt.hash(pwd, 10);

    const matchManager = new Manager({
      uid, name, gender, photo: photoBuffer, pwd: hashedPassword
    });
    await matchManager.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { uid, pwd } = req.body;
    if (!uid || !pwd)
      return res.status(400).json({ message: 'UID and password are required' });

    const user = await Manager.findOne({ uid });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        name: user.name,
        gender: user.gender,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get manager info with photo
app.get('/manager/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const manager = await Manager.findOne({ uid });

    if (!manager)
      return res.status(404).json({ message: 'Manager not found' });

    let photoData = null;
    if (manager.photo) {
        try {
            const buffer = await sharp(manager.photo)
            .resize({ width: 300, height: 300, fit: 'contain' })
            .jpeg({ quality: 95 })
            .toBuffer();
            photoData = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        } catch(err) {
            console.error('Image error:', err);
        }
    }

    res.json({
      uid: manager.uid,
      name: manager.name,
      gender: manager.gender,
      photo: photoData
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------------------- DRIVER ROUTES ---------------------- */
app.post('/add-driver', async (req, res) => {
  try {
    const { name, age, gender, carModel, carNumber, availability, cumid } = req.body;

    if (!name || !age || !gender || !carModel || !carNumber || !availability) {
      return res.status(400).json({ message: 'All fields except cumid are required' });
    }

    const driver = new Driver({
      name, age, gender, carmodel: carModel, carnumber: carNumber, availability, cumid: cumid ?? null
    });
    await driver.save();

    res.status(201).json({ message: 'Driver added successfully' });
  } catch (err) {
    console.error('Insert driver error:', err);
    res.status(500).json({ message: 'Failed to add driver' });
  }
});

/* ---------------------- ROOM ROUTES ---------------------- */
app.post('/add-room', async (req, res) => {
  try {
    const { roomNumber, bedType, condition, availability, price } = req.body;

    const room = new Room({
      roomnumber: roomNumber,
      bedtype: bedType,
      roomcondition: condition,
      availability,
      price
    });
    await room.save();

    res.status(200).json({ success: true, message: 'Room added successfully' });
  } catch (err) {
    console.error('Error inserting room:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

/* ---------------------- EMPLOYEE ROUTES ---------------------- */
app.post('/add-employee', async (req, res) => {
  try {
    const { name, age, gender, job, salary } = req.body;
    const employee = new Employee({ name, age, gender, job, salary });
    const result = await employee.save();
    res.json({ success: true, id: result._id });
  } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Insert error' });
  }
});

/* ---------------------- GET ALL ROUTES ---------------------- */
app.get('/api/alldrivers', async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.json(drivers);
  } catch (err) {
    console.error('Error retrieving drivers:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/allrooms', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/allemployees', async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.json(employees);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/allcustomers', async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.json(customers);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

/* ---------------------- CHECKIN ROUTES ---------------------- */
app.post('/checkin-customer', async (req, res) => {
  try {
    const {
      identityType,
      identityNumber,
      name,
      gender,
      checkInTime,
      bedType,
      roomNumber,
      amount,
    } = req.body;

    const customer = new Customer({
        identityType, identityNumber, name, gender, checkInTime, bedtype: bedType, roomnumber: roomNumber, amount
    });
    await customer.save();

    await Room.updateOne({ roomnumber: roomNumber }, { availability: "Occupied" });

    res.json({ message: 'Check-in successful' });
  } catch(err) {
      console.error(err);
      res.status(500).json({ message: 'Insert failed' });
  }
});

app.get('/checkin-rooms/:bedType', async (req, res) => {
  try {
    const { bedType } = req.params;
    const rooms = await Room.find({ bedtype: bedType, availability: "Available" });
    res.json(rooms.map((r) => r.roomnumber));
  } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
  }
});

/* ---------------------- CHECKOUT ROUTES ---------------------- */
app.get('/api/identity-numbers', async (req, res) => {
  try {
      const customers = await Customer.find({}, 'identityNumber');
      res.json(customers);
  } catch(err) {
      console.error(err);
      res.status(500).json({ error: err });
  }
});

app.get('/api/customer-detail/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findOne({ identityNumber: id }, 'name roomnumber checkInTime amount');

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    res.json({
        name: customer.name,
        roomnumber: customer.roomnumber,
        checkInTime: customer.checkInTime,
        amount: customer.amount
    });
  } catch(err) {
      res.status(500).json({ error: err.message });
  }
});

app.get('/api/room-price/:roomNumber', async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const room = await Room.findOne({ roomnumber: roomNumber });
    if (room) {
        res.send({ price: room.price });
    } else {
        res.status(404).send({ error: 'Room not found' });
    }
  } catch(err) {
      console.error(err);
      res.status(500).send({ error: 'Database error' });
  }
});

app.post('/api/checkout-customers', async (req, res) => {
  try {
    const { room_number, identity_key, customer } = req.body;

    console.log('Checkout request body:', req.body);

    await Room.updateOne({ roomnumber: room_number }, { roomcondition: "Dirty" });

    if (identity_key) {
        await Driver.updateOne({ cumid: identity_key }, { cumid: null, availability: "Available" });
    }

    if (customer) {
        await Customer.deleteOne({ identityNumber: customer });
    }

    res.send({ message: 'Checkout successful' });
  } catch(err) {
      console.error(err);
      res.status(500).send('Checkout failed');
  }
});

/* ---------------------- PICKUP ROUTES ---------------------- */
app.post('/api/assign-driver', async (req, res) => {
    try {
        const { driverName, cumid } = req.body;
        await Driver.updateOne({ name: driverName }, { availability: 'Occupied', cumid: cumid });
        res.json({ message: 'Driver assigned successfully' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to assign driver' });
    }
});

app.get('/api/pickup-drivers', async (req, res) => {
    try {
        const drivers = await Driver.find({ availability: 'Available' }, 'name carmodel carnumber');
        res.json(drivers.map(d => ({
            name: d.name,
            carmodel: d.carmodel,
            carnumber: d.carnumber
        })));
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/pickup-customers', async (req, res) => {
    try {
        const customers = await Customer.find({}, 'identityNumber name');
        res.json(customers.map(c => ({
            identityNumber: c.identityNumber,
            name: c.name
        })));
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

/* ---------------------- room cleaning ROUTES ---------------------- */
app.get('/dirty-room', async (req, res) => {
  try {
    const rooms = await Room.find(
      { roomcondition: 'Dirty', availability: 'Occupied' },
      'roomnumber bedtype price roomcondition availability'
    );
    res.json(rooms.map(r => ({
        roomnumber: r.roomnumber,
        bedtype: r.bedtype,
        price: r.price,
        roomcondition: r.roomcondition,
        availability: r.availability
    })));
  } catch(err) {
      console.error('Error fetching dirty rooms:', err);
      res.status(500).send('Database error');
  }
});

// Update room condition and availability
app.post('/room-cleaning', async (req, res) => {
  try {
    const { roomNumber, availability, condition } = req.body;

    const result = await Room.updateOne(
        { roomnumber: roomNumber },
        { availability: availability, roomcondition: condition }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room updated successfully' });
  } catch(err) {
      console.error('Error updating room:', err);
      res.status(500).send('Database error');
  }
});

/* ---------------------- SERVER START ---------------------- */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
