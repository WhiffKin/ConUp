import "./AboutMe.css";

function AboutMe() {
    return (
        <div className="about-container">
            <h1>About Me</h1>
            <div className="about-paragraph">
                <img src="https://aa-garrettlackey-meetupclone.s3.us-east-2.amazonaws.com/IMG_1448.jpg" alt="Garrett Lackey (right) and his wife Anna (left)"/>
                <span>
                    Hello, my name is Garrett Lackey and I spend most of my time 
                    with my wonderful wife Anna, playing guitar, or drawing. 
                    I&apos;ve been a hobbyist programmer for over a decade and 
                    in this time I learned 5 programming languages and have made 
                    complete applications in 3 of them. Some of these applications 
                    were made in frameworks such as: React, Express, or Unity; 
                    while others were made from the ground up by me and a close group of friends. 
                    All of my projects have one particular goal in common, 
                    to learn as much about the process as possible!
                </span>
            </div>
            <div className="about-paragraph">
                <span className="about-right">
                    When I decided to take this leap into Software Engineering <br/>
                    I was in my junior year of a physics degree from the <br/>University of Texas at Dallas, 
                    struggling to find my passion. When covid hit I took a break from college, 
                    and began diving deeper into programming. In this time I found what I was missing 
                    from my degree and started running with it, developing multiple game prototypes 
                    and a few games with full functionality. When I found App Academy I felt inspired 
                    and decided that it was time to take my next steps.
                </span>
                <div> 
                    <h3>Known Programming Languages</h3>
                    <ul>
                        <li>C#</li>
                        <li>C++</li>
                        <li>Java</li>
                        <li>JavaScript</li>
                        <li>Python</li>
                    </ul>
                </div>
            </div>
            <div className="about-paragraph">
                <span className="about-center">
                    App Academy has been wonderful for me, I&apos;ve met some amazing friends 
                    and discovered a new passion: Full-Stack Web Development! 
                    I am currently searching for a job in the Software Engineering field, so if your team could use a dedicated Engineer who loves solving problems I look forward to hearing from you!
                </span>
            </div>
            <div className="about-contact">
                <h3>Contact Info</h3>
                <span>Email: garrettlackey2018@gmail.com</span>
            </div>
        </div>
    )
}

export default AboutMe;