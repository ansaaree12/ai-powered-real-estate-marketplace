import React from 'react';
import './Contact.css';
import { MdCall } from 'react-icons/md';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { HiChatBubbleBottomCenter } from 'react-icons/hi2';

const Contact = () => {
    const phoneNumber = "+91 8080554608"; // Replace with actual phone number
    const whatsappNumber = "+918080554608"; // Add country code for WhatsApp

    // Function to handle Call
    const handleCall = () => {
        window.location.href = `tel:${phoneNumber}`;
    };

    // Function to handle SMS
    const handleMessage = () => {
        window.location.href = `sms:${phoneNumber}`;
    };

    // Function to handle Video Call (WhatsApp, Zoom, Skype)
    const handleVideoCall = () => {
        const videoCallLinks = [
            `https://wa.me/${whatsappNumber}?video=true`, // WhatsApp Video
            `zoommtg://zoom.us/join`, // Zoom (if installed)
            `skype:${phoneNumber}?call` // Skype Video Call
        ];
        window.open(videoCallLinks[0], '_blank'); // Opens WhatsApp Video
    };

    // Function to handle Chat (WhatsApp, Telegram, Messenger)
    const handleChat = () => {
        const chatLinks = [
            `https://wa.me/${whatsappNumber}`, // WhatsApp
            `https://t.me/${phoneNumber}`, // Telegram
            `https://m.me/${phoneNumber}` // Facebook Messenger
        ];
        window.open(chatLinks[0], '_blank'); // Opens WhatsApp Chat
    };

    return (
        <section className="c-wrapper">
            <div className="paddings innerWidth flexCenter c-container">
                {/* Left Side */}
                <div className="flexColStart c-left">
                    <span className='orangeText'>Our Contacts</span>
                    <span className='primaryText'>Easy to Contact Us</span>
                    <span className='secondaryText'>
                        We are always ready to help by providing the best services. We believe a good place to live can make your life better.
                    </span>
                    <div className="flexColStart contactModes">
                        {/* First Row */}
                        <div className="flexStart row">
                            {/* Call Mode */}
                            <div className="flexColCenter mode">
                                <div className="flexStart">
                                    <div className="flexCenter icon">
                                        <MdCall size={25} />
                                    </div>
                                    <div className="flexColStart detail">
                                        <span className='primaryText'>Call</span>
                                        <span className='secondaryText'>{phoneNumber}</span>
                                    </div>
                                </div>
                                <div className="flexCenter button" onClick={handleCall}>
                                    Call Now
                                </div>
                            </div>

                            {/* Chat Mode */}
                            <div className="flexColCenter mode">
                                <div className="flexStart">
                                    <div className="flexCenter icon">
                                        <BsFillChatDotsFill size={25} />
                                    </div>
                                    <div className="flexColStart detail">
                                        <span className='primaryText'>Chat</span>
                                        <span className='secondaryText'>{phoneNumber}</span>
                                    </div>
                                </div>
                                <div className="flexCenter button" onClick={handleChat}>
                                    Chat Now
                                </div>
                            </div>
                        </div>

                        {/* Second Row with centering wrapper */}
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <div className="flexStart row" style={{ justifyContent: 'center', maxWidth: 'fit-content' }}>
                                {/* Video Call Mode */}
                                <div className="flexColCenter mode">
                                    <div className="flexStart">
                                        <div className="flexCenter icon">
                                            <BsFillChatDotsFill size={25} />
                                        </div>
                                        <div className="flexColStart detail">
                                            <span className='primaryText'>Video Call</span>
                                            <span className='secondaryText'>{phoneNumber}</span>
                                        </div>
                                    </div>
                                    <div className="flexCenter button" onClick={handleVideoCall}>
                                        Video Call Now
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="c-right">
                    <div className="image-container">
                        <img src="./contact.png" alt="Contact" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;