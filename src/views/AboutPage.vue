<template>
  <div class="resume-container">
    <!-- Left Sidebar -->
    <div class="sidebar">
      <div class="name-section">
        <div class="avatar-container">
          <img src="https://via.placeholder.com/200" alt="Avatar">
        </div>
        <h1>{{ resume.name }}</h1>
        <h2>{{ resume.title }}</h2>
      </div>

      <div class="contact-info">
        <div class="contact-item">
          <i class="icon-email"></i>
          <span>{{ resume.email }}</span>
        </div>
        <div class="contact-item">
          <i class="icon-phone"></i>
          <span>{{ resume.phone }}</span>
        </div>
        <div class="contact-item">
          <i class="icon-location"></i>
          <span>{{ resume.address }}</span>
        </div>
        <div class="contact-item">
          <i class="icon-linkedin"></i>
          <span>{{ resume.linkedin }}</span>
        </div>
        <div class="contact-item">
          <i class="icon-website"></i>
          <span>{{ resume.website }}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <i class="icon-profile"></i>
          <h3>PROFILE</h3>
          <div class="divider"></div>
        </div>
        <p class="profile-text">{{ resume.profile }}</p>
      </div>

      <div class="section">
        <div class="section-header">
          <i class="icon-education"></i>
          <h3>EDUCATION</h3>
          <div class="divider"></div>
        </div>
        <div v-for="(edu, index) in resume.education" :key="index" class="education-item">
          <h4>{{ edu.degree }}</h4>
          <p>{{ edu.school }}</p>
          <p>{{ edu.years }} | {{ edu.location }}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <i class="icon-languages"></i>
          <h3>LANGUAGES</h3>
          <div class="divider"></div>
        </div>
        <div v-for="(lang, index) in resume.languages" :key="index" class="language-item">
          <div class="language-name">{{ lang.name }}</div>
          <div class="language-level">
            <span v-for="n in 5" :key="n" :class="['dot', n <= lang.level ? 'filled' : '']"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Content -->
    <div class="main-content">
      <div class="section">
        <div class="section-header">
          <i class="icon-experience"></i>
          <h3>PROFESSIONAL EXPERIENCE</h3>
          <div class="divider"></div>
        </div>

        <div v-for="(exp, index) in resume.experience" :key="index" class="experience-item">
          <h4>{{ exp.company }}</h4>
          <p class="job-title">{{ exp.title }}</p>
          <p class="job-period">{{ exp.period }} | {{ exp.location }}</p>
          <ul class="achievements">
            <li v-for="(achievement, i) in exp.achievements" :key="i">
              {{ achievement }}
            </li>
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <i class="icon-skills"></i>
          <h3>SKILLS</h3>
          <div class="divider"></div>
        </div>
        <div class="skills-container">
          <div v-for="(skill, index) in resume.skills" :key="index" class="skill-badge">
            {{ skill }}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <i class="icon-awards"></i>
          <h3>AWARDS</h3>
          <div class="divider"></div>
        </div>
        <div v-for="(award, index) in resume.awards" :key="index" class="award-item">
          <h4>{{ award.title }}</h4>
          <p>{{ award.organization }}, {{ award.year }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResumeTemplate',
  data() {
    return {
      resume: {
        name: 'senjay',
        title: '2005-06-21',
        email: '3381335358@qq.com',
        phone: ' 18750767579',
        address: '22611 Pacific Coast Hwy, Malibu, California, 9022, USA',
        linkedin: 'linkedin.com/wayne-2345',
        website: 'wayne.com',
        profile: 'I\'m Brian Thomas Wayne, a business development consultant with a passion for helping companies achieve their growth potential. With my MBA degree and extensive experience in strategy and relationship building, I strive to provide innovative solutions that drive success for my clients.',
        education: [
          {
            degree: 'Master of Business Administration',
            school: 'Harvard Business School',
            years: '2016 – 2018',
            location: 'Boston'
          },
          {
            degree: 'Master of Business Administration',
            school: 'Harvard Business School',
            years: '2015 – 2018',
            location: 'Boston'
          }
        ],
        languages: [
          { name: 'English', level: 5 },
          { name: 'Spanish', level: 4 }
        ],
        experience: [
          {
            company: 'Appleseed Inc.',
            title: 'Business Development Consultant',
            period: '2022 – present',
            location: 'NewYork',
            achievements: [
              'Developed and implemented strategic plans resulting in a 30% increase in new business opportunities.',
              'Collaborated with cross-functional teams to drive business growth and expansion.',
              'Established and maintained relationships with key partners resulting in a 25% increase in sales revenue.',
              'Conducted market research and analysis to identify new market opportunities resulting in the successful launch of a new product line.'
            ]
          },
          {
            company: 'Aexus',
            title: 'Business Development',
            period: '2018 – 2022',
            location: 'Los Angeles, USA',
            achievements: [
              'Worked closely with tech and software companies to provide expert sales outsourcing services',
              'Built and managed dedicated sales teams in Europe, the Americas, and Asia Pacific',
              'Contributed to Aexus Sales Outsourcing\'s proven track record of success in acting as an extension to the sales force of over 500+ vendors of new and innovative software and tech products, services, and solutions since the year 2000.'
            ]
          }
        ],
        skills: [
          'Strategic thinking and problem-solving',
          'Relationship building and networking',
          'Creative and innovative thinking'
        ],
        awards: [
          {
            title: 'Outstanding Business Student Award',
            organization: 'University of Southern California',
            year: '2014'
          },
          {
            title: 'Dean\'s List',
            organization: 'University of California, Los Angeles',
            year: '2015-2016'
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
:root {
  --primary-color: #2c3e50;
  --accent-color: #e74c3c;
  --text-light: #ffffff;
  --text-dark: #333333;
  --background-light: #ffffff;
  --divider-color: #e74c3c;
  --skill-bg: #f8d7da;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.resume-container {
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
}

/* Sidebar Styles */
.sidebar {
  background: linear-gradient(135deg, #1a1c2a, #2d3154);
  color: rgba(255, 255, 255, 0.95);
  padding: 40px;
  width: 35%;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

.name-section {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.avatar-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border-radius: 50%;
  padding: 8px;
  background: linear-gradient(135deg, #00a2ff, #0066ff);
  position: relative;
  overflow: hidden;
}

.avatar-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-radius: 50%;
  z-index: 1;
}

.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.2);
}

.name-section h1 {
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
}

.name-section h2 {
  font-size: 1.3rem;
  font-weight: 500;
  color: #00a2ff;
  letter-spacing: 0.02em;
  text-shadow: 0 0 20px rgba(0, 162, 255, 0.5);
}

.contact-info {
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.07);
  padding: 25px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.9);
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
  color: #ffffff;
}

.contact-item i {
  margin-right: 15px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  font-size: 1.1rem;
  color: #00a2ff;
  box-shadow: 0 0 15px rgba(0, 162, 255, 0.3);
}

.profile-text {
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.education-item {
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.education-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.education-item h4 {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}

.education-item p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  margin-bottom: 5px;
  letter-spacing: 0.02em;
}

.language-item {
  background: rgba(255, 255, 255, 0.07);
  padding: 12px 15px;
  border-radius: 10px;
  margin-bottom: 12px;
}

.language-name {
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.02em;
}

.sidebar .section-header h3 {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.sidebar .divider {
  flex-grow: 1;
  height: 2px;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.2), transparent);
  margin-left: 15px;
}

/* Main Content Styles */
.main-content {
  background-color: #fff;
  padding: 40px;
  width: 65%;
}

.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #00a2ff, transparent);
}

.section-header i {
  margin-right: 15px;
  color: #00a2ff;
  font-size: 1.5rem;
}

.section-header h3 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1c2a;
  letter-spacing: 1px;
}

/* Experience Items */
.experience-item {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 15px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.experience-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.experience-item h4 {
  color: #00a2ff;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.job-title {
  font-weight: 600;
  color: #1a1c2a;
  margin-bottom: 8px;
}

.job-period {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.achievements {
  padding-left: 20px;
}

.achievements li {
  margin-bottom: 10px;
  line-height: 1.6;
  position: relative;
  padding-left: 20px;
}

.achievements li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: #00a2ff;
}

/* Skills Section */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-badge {
  background: linear-gradient(135deg, #f8f9fa, #fff);
  color: #00a2ff;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.95rem;
  border: 1px solid rgba(0, 162, 255, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.skill-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-color: #00a2ff;
}

/* Language Section */
.language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.language-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.language-level {
  display: flex;
  gap: 5px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.dot.filled {
  background: #00a2ff;
  box-shadow: 0 0 10px rgba(0, 162, 255, 0.5);
}

/* Awards Section */
.award-item {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.award-item:hover {
  transform: translateX(5px);
  background: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.award-item h4 {
  color: #00a2ff;
  margin-bottom: 5px;
}

/* Icons */
[class^="icon-"] {
  display: inline-block;
  width: 20px;
  height: 20px;
  position: relative;
}

.icon-email::before {
  content: "✉";
}

.icon-phone::before {
  content: "☎";
}

.icon-location::before {
  content: "📍";
}

.icon-linkedin::before {
  content: "🔗";
}

.icon-website::before {
  content: "🌐";
}

.icon-profile::before {
  content: "👤";
}

.icon-education::before {
  content: "🎓";
}

.icon-languages::before {
  content: "🌍";
}

.icon-experience::before {
  content: "💼";
}

.icon-skills::before {
  content: "🛠";
}

.icon-awards::before {
  content: "🏆";
}

/* Responsive Design */
@media (max-width: 1024px) {
  .resume-container {
    margin: 1rem;
    flex-direction: column;
  }

  .sidebar,
  .main-content {
    width: 100%;
  }

  .avatar-container {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 768px) {
  .skills-container {
    gap: 8px;
  }

  .skill-badge {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}
</style>