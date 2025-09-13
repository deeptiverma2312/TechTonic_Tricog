import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./home.module.css";
import Footer from "../../components/Footer/Footer";
import { useRef, useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { LazyLoadImage } from "react-lazy-load-image-component";

function Home() {
  const [imagesInView, setImagesInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImagesInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.9 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [imagesInView]);

  return (
    <>
      <Navbar />
      <div className={styles.herosection}>
        {/* Background Video */}
        <video
          className={styles.heroVideo}
          src="https://anginax.ai/public/frontend-assets/video/header_video.mp4"
          autoPlay
          muted
          loop
          playsInline
        ></video>
        <div className={styles.img1}>
          <LazyLoadImage src="img1.webp" />
        </div>
        <div className={styles.content}>
          <TypeAnimation
            sequence={[
              "CARING FOR LIFE",
              1000,
              "CARING FOR YOU",
              1000,
              "CARING FOR HEALTH",
              1000,
              "CARING FOR FUTURE",
              1000,
            ]}
            speed={0}
            repeat={Infinity}
          />
          <div className={styles.content2}>
            AI Doctor Assistant <br></br> for Medical Excellence
          </div>
          {/* CHANGED: Link now goes to registration instead of direct to chat */}
          <Link to="/register">
            <div className={styles.content3}>Get Started</div>
          </Link>
        </div>
        <div className={styles.group}>
          <LazyLoadImage src="Group.webp" />
        </div>
        <div ref={sectionRef} className={styles.features}>
          <div className={styles.featureCard}>
            <h3>AI-Powered Analysis</h3>
            <p>Get instant health insights using advanced medical AI</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Symptom Assessment</h3>
            <p>Comprehensive symptom evaluation and medical guidance</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Quick Results</h3>
            <p>Receive your health assessment in minutes, not hours</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;