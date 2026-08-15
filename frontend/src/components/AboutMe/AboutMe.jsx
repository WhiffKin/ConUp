import "./AboutMe.css";

function AboutMe() {
    return (
        <div className="about-container">
            <h1>About Me</h1>
            <div className="about-paragraph">
                <span>
                    Hello, my name is Garrett Lackey and I spend most of my time 
                    playing guitar, or drawing. I&apos;ve been a programmer
                    for over a decade and in this time I learned 6 programming languages 
                    and have made complete applications in 4 of them. Some of these 
                    applications were made in frameworks such as: React, Express, or Unity; 
                    while others were made from the ground up by me and a close group 
                    of friends. All of my projects have one particular goal in common, 
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
                        <li>AutoCAD Scripting</li>
                    </ul>
                </div>
            </div>
            <div className="about-contact">
                <h3>Contact Info</h3>
                <span>Email: garrettlackey2018@gmail.com</span>
            </div>
        </div>
    )
}

export default AboutMe;