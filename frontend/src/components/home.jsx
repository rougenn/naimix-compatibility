import Navbar from "./Navbar";
import './home.css';
import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";


export default function Home() {
    return (
        <div className="wrapper">
            <Navbar />
            <main>
                <section id="section1" className="section">
                    <Section1 />
                </section>
                <section id="section2" className="section">
                    <Section2 />
                </section>
                <section id="section3" className="section">
                    <Section3 />
                </section>
            </main>
        </div>
    );
}
