import React from 'react';
import './Hero.css';
import CountUp from "react-countup";
import {motion} from 'framer-motion'
import SearchBar from '../SearchBar/SearchBar';

const Hero = () => {
    return(
        <section className="hero-wrapper">
            {/* Full background video */}
            <div className="video-background">
                <video autoPlay loop muted playsInline>
                    <source src="./hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            
            <div className="paddings innerWidth flexCenter hero-container">
                {/* left side */}
                <div className="flexColStart hero-left">
                   <div className="hero-title">
                    <div className="orange-circle"/>
                    <motion.h1
                    initial={{y:"2rem", opacity:0}}
                    animate={{y:0, opacity:1}}
                    transition={{
                        duration:2,
                        type: "spring"
                    }}
                    >
                        Discover <br />
                        Most Suitable <br /> Property
                    </motion.h1>
                   </div>

                   <div className="flexColStart hero-des">
                    <span className='secondaryText white-text'>Find a varity of properties that suit you very easily</span>
                    <span className='secondaryText white-text'>Forget all the difficulties in finding a residence for you</span>
                   </div>

                   <SearchBar/>

                   <div className="flexCenter stats">
                    <div className="flexColCenter stat">
                        <span>
                            <CountUp start={8800} end={9000} duration={4} />
                            <span>+</span>
                        </span>
                        <span className='secondaryText white-text'> Premium Products</span>
                    </div>

                    <div className="flexColCenter stat">
                        <span>
                            <CountUp start={1950} end={2000} duration={4} />
                            <span>+</span>
                        </span>
                        <span className='secondaryText white-text'> Happy Customers</span>
                    </div>

                    <div className="flexColCenter stat">
                        <span>
                            <CountUp end={28}/>
                            <span>+</span>
                        </span>
                        <span className='secondaryText white-text'> Award Winning</span>
                    </div>
                   </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;