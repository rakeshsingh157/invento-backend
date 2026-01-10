const { getDB } = require('../connection/mongodb');
const bcrypt = require('bcryptjs');

class Admin {
  constructor() {
    this.collectionName = 'admins';
  }

  getCollection() {
    const db = getDB();
    return db.collection(this.collectionName);
  }

  async createAdmin(adminData) {
    try {
      const collection = this.getCollection();
      
      // Check if admin already exists
      const existingAdmin = await collection.findOne({ email: adminData.email });
      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      const admin = {
        email: adminData.email,
        password: hashedPassword,
        name: adminData.name || '',
        role: adminData.role || 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      const result = await collection.insertOne(admin);
      
      // Remove password from returned object
      delete admin.password;
      admin._id = result.insertedId;
      
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const collection = this.getCollection();
      const admin = await collection.findOne({ email });
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const { ObjectId } = require('mongodb');
      const collection = this.getCollection();
      const admin = await collection.findOne({ _id: new ObjectId(id) });
      
      if (admin) {
        delete admin.password;
      }
      
      return admin;
    } catch (error) {
      throw error;
    }
  }

  async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  async updateAdmin(id, updateData) {
    try {
      const { ObjectId } = require('mongodb');
      const collection = this.getCollection();
      
      // If password is being updated, hash it
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      updateData.updatedAt = new Date();

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (result) {
        delete result.password;
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteAdmin(id) {
    try {
      const { ObjectId } = require('mongodb');
      const collection = this.getCollection();
      
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async getAllAdmins() {
    try {
      const collection = this.getCollection();
      const admins = await collection.find({}).project({ password: 0 }).toArray();
      return admins;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new Admin();
