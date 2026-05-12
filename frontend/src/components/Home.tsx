import "./Home.css";
import { Link } from "react-router";

function Home() {
  return (
    <div className="home-content">
      <h1 className="home-title">Welcome to the School Website!</h1>
      <p>
        Ok, this isn't a real school website. It's just a demo site for a
        project I've been working on to learn more about React and Django. As
        you now, the code is in a public repo on Github (
        <a target="_blank" href="https://github.com/Young-Griff/DjangoReact">
          here
        </a>
        ). So, you can run it for yourself and see how it works.
      </p>
      <p>
        This is a work in progress, and I plan to make some adjustments moving
        forward. So, be sure to check back every now and then for updates. And,
        if you have any suggestions, please feel free to reach out to me at{" "}
        <a href="mailto:tf350@scarletmail.rutgers.edu">
          tf350@scarletmail.rutgers.edu
        </a>
        .
      </p>
      <p>Enjoy palying around with the site! :)</p>
    </div>
  );
}

export default Home;
