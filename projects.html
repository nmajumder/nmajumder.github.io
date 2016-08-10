<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Nathan Majumder</title>
    <link rel="stylesheet" href="css/normalize.css">
    <link href='http://fonts.googleapis.com/css?family=Josefin+Sans:400,600|Exo:400,600,600italic|Muli' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="css/mystyle.css">
    <link rel="stylesheet" href="css/responsive.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <header>
      <a href="index.html" id="logo">
        <h1>Nathan Majumder</h1>
      </a>
      <nav>
        <ul>
          <li><a href="index.html">Homepage</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="resume.html">Resume</a></li>
          <li><a href="projects.html" class="selected">Projects</a></li>          
          <li><a href="abroad.html">Abroad</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>
    </header>
    
    <div id="wrapper">
      <section>
        <h3 class="center">I want to share some cool projects I've worked on, both in classes and outside of school.</h3>
        <section>
          <h4 class="italics">Magic Freeze Frame</h4>
          <section id="vids">
            <video controls>
              <source src="vids/freeze-frame-together.mp4" type="video/mp4">
            </video>
            <video controls>
              <source src="vids/freeze-frame-pass.mp4" type="video/mp4">
            </video>
          </section>
          <section id="ffDescrip">
            <p>Probably my favorite project I've ever completed, this was a final assignment in my Computer Vision class in Budapest while abroad. It was slightly open-ended, and I and two other students decided to work together on writing a program that would take in a video of an empty picture frame being moved around, and at some specified point in the video it would freeze the contents of the frame and for the rest of the video (or however long we wanted), the frame would look like it had the picture of the freeze frame shot in there.</p>
            <p>This project was a culmination of many techniques we learned throughout the semester, so the code base had been somewhat built up from previous assignments, but the functionality for the freeze frame was entirely written by us. The general flow of the program in terms of computer vision techniques is as follows:</p>
            <ol>
              <li>At a certain specified frame number (when we want to start freezing the image inside the picture frame), we perform a global feature detection for the four corners of the picture frames. We use a greenish marker as our feature, and attempt to find these markers by thresholding the relative rgb values and the brightness. We collect all of the points that fall into this threshold category, and then perform K-means on the points to get 4 clusters. We experimented with the threshold values for long enough that we are confident that K-means will find the correct points, even without multiple iterations. We take the centroids of these clusters and store them as the corners of the frame for future use, along with the image that we want to freeze. For all future frames, the process of finding the corners is much quicker, because we can perform a local feature detection around the location of the previous frame's corners.</li>
              <br>
              <li>After finding the corners of the frame (and already knowing the corners of the previous frame), we perform a Direct Linear Transformation (DLT) to find the 3x3 homography matrix H that maps all points x from image A to corresponding point x' in image B by the equation xH = x'. Note the points x are stored in homogeneous coordinates, so a point has form [x, y, 1]. Now, we can map all points from one image to the other (and vice versa using H inverse).</li>
              <br>
              <li>Finally, we use an inverse warp to take pixels from frame image A and paste them into frame image B to keep the illusion that the frozen image has followed the picture frame. Note, we use an inverse warp instead of a forward warp (which would go through pixels in image A and paste them to their location in image B), because if we instead iterate through all applicable pixels in image B and grab the corresponding ones from image A, we won't have spots in B that don't get mapped to. A surprisingly difficult first step in the warp is to even figure out from the corners which pixels on image B were inside the frame and needed to be mapped to, when we didn't know the orientation or shape of the picture frame at that instant. When we had equations of lines that outlined the frame, we iterated through the pixels within it and used the homography matrix to grab the frozen pixels and paste them in.</li>
            </ol>
            <p>Coded in C++, project found on my github at <a href="https://github.com/nmajumder/MagicFreezeFrame">https://github.com/nmajumder/MagicFreezeFrame</a>.</p>
          </section>
          <h4 class="italics">Run4it</h4>
          <section id="run4it_pics">
            <img src="img/run4it_shots/nav_bar.jpg">
            <img src="img/run4it_shots/prof_stats.jpg">
            <img src="img/run4it_shots/competitions.jpg">
            <img src="img/run4it_shots/comp_details.jpg">
          </section>
          <section id="run4itDescrip">
            <p>My final project for my Mobile Software Development class at AIT-Budapest, I developed this Android app with a friend, Jake Watton. The overview is laid out in the README on the Github page for the project, but the idea is to develop a competition-based calorie burning app that would provide users with incentive to workout, by rewarding hard work with prizes such as equipment and gym memberships (this would be a later stage of the app once users were buying the app). We were planning to make use of the Fitbit API to ensure users' honesty, but unfortunately, it turned out that Fitbit only has a web api, and it would have required more time than we had. So as of now it cannot verify or pull data from Fitbit, but it has the capability for users to work towards personal goals and objectives, and keep track of their total running and calorie burning statistics in various time increments.</p>
            <p>The layout of the app is rooted in a navigation drawer, which has options to visit screens for personal information and statistics, personal goals, objectives (that we provide and the user tries to fulfill), and competitions (again, that we provide but all users can enter). We use local storage (Sugar ORM) for personal goals, as users can set these themselves. We use Backendless to store a User's information plus their status in competitions and objectives. We also use Backendless to set the objectives and competitions for the users to see and enter and work toward.</p>
            <p>The goal is to continue to work on this project whenever we have time, with the obvious next step being to incorporate Fitbit in order to take Users' workout data straight from there. Once we do that, we can begin to market it as an app with a competitive aspect, rather than just a personal gain type of app.</p>
            <p>Coded using in Android Studio, project can be found on my Github at <a href="https://github.com/nmajumder/Run4it">https://github.com/nmajumder/Run4it</a>.</p> 
          </section>
        </section>
      </section>
      
      <footer>
        <a href="http://facebook.com/nathanmajumder"><img src="img/FB_logo.png" alt="Facebook logo"></a>
        <a href="https://www.linkedin.com/pub/nathan-majumder/a6/29/b34?domainCountryName=&csrfToken=ajax%3A6249601243831115177"><img src="img/LI_logo.png" alt="LinkedIn logo"></a>
        <p>&copy; 2015 Nathan Majumder.</p>
      </footer>
    </div>
  </body>
</html>