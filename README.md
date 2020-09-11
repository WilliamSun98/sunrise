# SunRise
# Read Time Domain: https://sunrise.4jhs.com/(the domain is no longer in use)

### Team Member:
 - Jialiang Lin (jialiang.lin@mail.utoronto.ca)
 - Kaihua Sun (kaihua.sun@mail.utoronto.ca)
 - Suxin Hong (suxin.hong@mail.utoronto.ca)

### Application Description
SunRise is a website that focuses on the university students' developments. As a website, it provides a platform for companies to post their latest work information(co-op/internship). To the students, it shows the latest information on extracurricular activities, job markets and volunteer work. In SunRise, we match the employers to employees, students to activities, and so on. 

### Key features that can be released on Beta Version
- Authentication and multi level user implementation
- Cross site data fetch
- Backend Token authentication
- User profile fetch and update
- Implementation of UI for student and employeer
- Implementated Job markets and interview scheduling section

### Key features that can be released on Final Version
- Asynchronous poll using Web LongPoll
- Integrate AutoMailing API to interview scheduling section and Weather API for the header
- List all possible oncoming extracurricular activities for student to join
- Company and student can schedule their interviews on calender
- Integrate auto mail API in order to inform user corresponding news
- Certificate for Apache Server (Back-end server)
- Certificate for AWS S3 (Front-end)

### Technology
- Version Control
Github
- Division of work
Trello for sprint plan and burndown chart
- Submission of Work
We would be following a branch policy as followed to ensure our master branch is working.
If the work isn't on the main branch, it isn't considered completed
- Frontend Language
Angular
- Backend Language
Django and python
- Database
PostgrelSQL
- Frontend Deployment
AmazonAWS S3 Storage Bucket
AmazonAWS CloudFont
AmazonAWS Route53 Services
- Backend Deployment
AmazonAWS EC2 Computing Service
Gunicorn WSGI environment
NGINX
Database
AmazonAWS RDS Postgresql Database



### Challenge
- new framework(front-end: angular, back-end: django, db: postgreSql)
- several apis(weather api, automailing api)
- cross site authentification
- Certificate Gerneration of Apache
- Certificate Gerneration of Frontend
- multiple levels of user design(club coordinator, students and company employer)
- Asynchronous poll(Long Pull)
