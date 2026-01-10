const Team = require('../db/models/Team');
const { sendTeamRegistrationEmails } = require('../services/emailService');

// @desc    Register a new team
// @route   POST /api/teams/register
// @access  Public
const registerTeam = async (req, res) => {
  try {
    const teamData = req.body;

    // Validation
    // Team size: Minimum 1 member (leader only), Maximum 5 members (leader + 4 additional members)
    if (!teamData.team_name) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required'
      });
    }

    // Leader is required (minimum 1 member)
    if (!teamData.leader || !teamData.leader.name || !teamData.leader.email || !teamData.leader.phone || !teamData.leader.year || !teamData.leader.class) {
      return res.status(400).json({
        success: false,
        message: 'Leader information (name, email, phone, year, class) is required'
      });
    }

    // College name is required
    if (!teamData.college_name) {
      return res.status(400).json({
        success: false,
        message: 'College name is required'
      });
    }

    // Email validation for leader
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teamData.leader.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email for team leader'
      });
    }

    // Validate member emails if provided
    const members = ['member2', 'member3', 'member4', 'member5'];
    for (const memberKey of members) {
      if (teamData[memberKey] && teamData[memberKey].email) {
        if (!emailRegex.test(teamData[memberKey].email)) {
          return res.status(400).json({
            success: false,
            message: `Please provide a valid email for ${memberKey}`
          });
        }
      }
    }

    // Create team
    const team = await Team.createTeam(teamData);

    // Send registration emails to all team members
    let emailResults;
    try {
      emailResults = await sendTeamRegistrationEmails(team);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Team is registered but emails failed
      return res.status(201).json({
        success: true,
        message: 'Team registered successfully, but email notification failed. Please contact support.',
        data: {
          team,
          emailStatus: 'failed'
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Team registered successfully! Confirmation emails sent to all members.',
      data: {
        team,
        emailStatus: 'sent',
        emailsSent: emailResults.totalSent,
        emailsFailed: emailResults.totalFailed
      }
    });
  } catch (error) {
    console.error('Team registration error:', error);

    if (error.message === 'Team name already exists. Please choose a different name.' ||
        error.message === 'One or more email addresses are already registered with another team') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during team registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private (Admin only)
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.getAllTeams();

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching teams'
    });
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private (Admin only)
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team'
    });
  }
};

// @desc    Get team by name
// @route   GET /api/teams/name/:teamName
// @access  Private (Admin only)
const getTeamByName = async (req, res) => {
  try {
    const team = await Team.findByTeamName(req.params.teamName);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching team'
    });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (Admin only)
const updateTeam = async (req, res) => {
  try {
    const team = await Team.updateTeam(req.params.id, req.body);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data: team
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating team'
    });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Admin only)
const deleteTeam = async (req, res) => {
  try {
    const deleted = await Team.deleteTeam(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting team'
    });
  }
};

// @desc    Get team screenshot
// @route   GET /api/teams/:id/screenshot
// @access  Private (Admin only)
const getTeamScreenshot = async (req, res) => {
  try {
    const team = await Team.getTeamScreenshot(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        team_name: team.team_name,
        screenShot: team.screenShot || ''
      }
    });
  } catch (error) {
    console.error('Get screenshot error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching screenshot'
    });
  }
};

// @desc    Get team statistics
// @route   GET /api/teams/stats
// @access  Private (Admin only)
const getTeamStats = async (req, res) => {
  try {
    const teams = await Team.getAllTeams();
    
    let totalMembers = 0;
    teams.forEach(team => {
      totalMembers += Team.getTeamMemberCount(team);
    });

    res.status(200).json({
      success: true,
      data: {
        totalTeams: teams.length,
        totalParticipants: totalMembers,
        averageTeamSize: teams.length > 0 ? (totalMembers / teams.length).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};

module.exports = {
  registerTeam,
  getAllTeams,
  getTeamById,
  getTeamByName,
  updateTeam,
  deleteTeam,
  getTeamStats,
  getTeamScreenshot
};
