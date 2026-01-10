const { getDB } = require('../connection/mongodb');

class Team {
  constructor() {
    this.collectionName = 'teams';
  }

  getCollection() {
    const db = getDB();
    return db.collection(this.collectionName);
  }

  async createTeam(teamData) {
    try {
      const collection = this.getCollection();
      
      // Validate required fields
      if (!teamData.team_name) {
        throw new Error('Team name is required');
      }

      // Validate leader
      if (!teamData.leader || !teamData.leader.name || !teamData.leader.email || !teamData.leader.phone || !teamData.leader.year || !teamData.leader.class) {
        throw new Error('Leader information (name, email, phone, year, class) is required');
      }

      // Check if team name already exists
      const existingTeam = await collection.findOne({ team_name: teamData.team_name });
      if (existingTeam) {
        throw new Error('Team name already exists. Please choose a different name.');
      }

      // Check if any email is already registered
      const emails = [teamData.leader.email];
      ['member2', 'member3', 'member4', 'member5'].forEach(memberKey => {
        if (teamData[memberKey] && teamData[memberKey].email) {
          emails.push(teamData[memberKey].email);
        }
      });

      const duplicateEmail = await collection.findOne({
        $or: [
          { 'leader.email': { $in: emails } },
          { 'member2.email': { $in: emails } },
          { 'member3.email': { $in: emails } },
          { 'member4.email': { $in: emails } },
          { 'member5.email': { $in: emails } }
        ]
      });

      if (duplicateEmail) {
        throw new Error('One or more email addresses are already registered with another team');
      }

      const team = {
        team_name: teamData.team_name,
        leader: {
          year: teamData.leader.year,
          class: teamData.leader.class,
          name: teamData.leader.name,
          email: teamData.leader.email.toLowerCase(),
          phone: teamData.leader.phone
        },
        college_name: teamData.college_name,
        idea: teamData.idea || '',
        gameName: teamData.gameName || '',
        screenShot: teamData.screenShot || '',
        registeredAt: new Date(),
        status: 'registered'
      };

      // Add optional members
      ['member2', 'member3', 'member4', 'member5'].forEach(memberKey => {
        if (teamData[memberKey] && teamData[memberKey].name && teamData[memberKey].email) {
          team[memberKey] = {
            year: teamData[memberKey].year || '',
            class: teamData[memberKey].class || '',
            name: teamData[memberKey].name,
            email: teamData[memberKey].email.toLowerCase(),
            phone: teamData[memberKey].phone || ''
          };
        }
      });

      const result = await collection.insertOne(team);
      team._id = result.insertedId;
      
      return team;
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      const { ObjectId } = require('mongodb');
      const collection = this.getCollection();
      const team = await collection.findOne({ _id: new ObjectId(id) });
      return team;
    } catch (error) {
      throw error;
    }
  }

  async findByTeamName(teamName) {
    try {
      const collection = this.getCollection();
      const team = await collection.findOne({ team_name: teamName });
      return team;
    } catch (error) {
      throw error;
    }
  }

  async getAllTeams() {
    try {
      const collection = this.getCollection();
      // Exclude screenshot field for faster response
      const teams = await collection.find({}, {
        projection: { screenShot: 0 }
      }).toArray();
      return teams;
    } catch (error) {
      throw error;
    }
  }

  async getTeamScreenshot(id) {
    try {
      const { ObjectId } = require('mongodb');
      const collection = this.getCollection();
      // Only fetch screenshot field
      const team = await collection.findOne(
        { _id: new ObjectId(id) },
        { projection: { screenShot: 1, team_name: 1 } }
      );
      return team;
    } catch (error) {
      throw error;
    }
  }

  async updateTeam(id, updateData) {
    try {
      const { ObjectId } = require('mongodb');
      const collection = this.getCollection();
      
      updateData.updatedAt = new Date();

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteTeam(id) {
    try {
      const { ObjectId } = require('mongodb');
      const collection = this.getCollection();
      
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get all team members' emails
  getTeamEmails(team) {
    const emails = [team.leader.email];
    ['member2', 'member3', 'member4', 'member5'].forEach(memberKey => {
      if (team[memberKey] && team[memberKey].email) {
        emails.push(team[memberKey].email);
      }
    });
    return emails;
  }

  // Get team member count
  getTeamMemberCount(team) {
    let count = 1; // Leader
    ['member2', 'member3', 'member4', 'member5'].forEach(memberKey => {
      if (team[memberKey] && team[memberKey].name) {
        count++;
      }
    });
    return count;
  }
}

module.exports = new Team();
