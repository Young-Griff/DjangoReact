import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import axios from "axios";
import "./Departments.css";

axios.defaults.withCredentials = true;

type DepartmentRow = {
  dept: string;
  dept_short: string;
};

async function getDepartments() {
  try {
    if (localStorage.getItem("departments") == null) {
      console.log("HERE");
      useEffect(() => {
        fetchData();
      }, []);
      // Match API host to the page host so the session cookie from Django (localhost
      // vs 127.0.0.1) is always sent with credentialed requests.
      const apiURL = localStorage.getItem("apiURL");
      console.log(apiURL);
      const fetchData = async () => {
        const response = await axios.get(apiURL + "departments/", {
          withCredentials: true,
        });
        console.log(response.data);
        localStorage.setItem("departments", JSON.stringify(response.data));
      };
      console.log("DONE");
    }
  } catch (e: any) {
    console.log(e);
  }
}

/** File base name under public/images/depts/, e.g. chemistry → /images/depts/chemistry.jpg */
function deptImageSrc(slug: string): string {
  const jpgs = ["finance"];
  if (jpgs.includes(slug)) return `/images/depts/${slug}.jpg`;
  else return `/images/depts/${slug}.webp`;
}

function DepartmentCardImage({ slug }: { slug: string }) {
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const src = usePlaceholder
    ? "/images/depts/placeholder.svg"
    : deptImageSrc(slug);

  return (
    <div className="dept-card__media">
      <img
        className="dept-card__img"
        src={src}
        alt=""
        loading="lazy"
        onError={() => {
          if (!usePlaceholder) setUsePlaceholder(true);
        }}
      />
    </div>
  );
}

export function DepartmentList() {
  //const [depts, setDepts] = useState<DepartmentRow[]>([]);
  getDepartments();
  console.log(localStorage.getItem("departments"));
  const depts = JSON.parse(localStorage.getItem("departments") || null);
  if (depts == null) {
    return <h1>Error Fetching Departments :( </h1>
  }
  console.log(depts);
  //setDepts(deptResponse);

  return (
    <section className="dept-list">
      <h1 className="dept-list__title">Departments &amp; Programs</h1>
      <ul className="dept-list__grid">
        {depts.map((deptData: DepartmentRow, index: number) => {
          const slug = deptData.dept.toLowerCase().replace(/\s+/g, "-");
          return (
            <li key={`${deptData.dept_short}-${index}`}>
              <Link className="dept-card" to={slug}>
                <DepartmentCardImage slug={slug} />
                <div className="dept-card__body">
                  <h2 className="dept-card__name">{deptData.dept}</h2>
                  <p className="dept-card__code">{deptData.dept_short}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type DeptDetailsProp = {
  dept: string;
  dean_fname: string;
  dean_lname: string;
  dean_email: string;
};

type Course = {
  dept: string;
  cid: string;
  name: string;
  credits: number;
};

function DeptDetails(DeptDetails: DeptDetailsProp) {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  // Match API host to the page host so the session cookie from Django (localhost
  // vs 127.0.0.1) is always sent with credentialed requests.
  const apiURL = localStorage.getItem("apiURL");
  const fetchData = async () => {
    const response = await axios.get(
      apiURL + `department-courses/${DeptDetails.dept}`,
      {
        withCredentials: true,
      },
    );
    console.log(response);
    setCourses(response.data);
    console.log(courses);
  };
  return (
    <div>
      <h1>{DeptDetails.dept}</h1>
      <p>
        Dean: {DeptDetails.dean_fname} {DeptDetails.dean_lname}
      </p>
      <p>Email: {DeptDetails.dean_email}</p>
      <ul>
        {courses.map((courseData: Course) => (
          <li key={courseData.dept.split(" - ")[1] + String(courseData.cid)}>
            {courseData.dept.split(" - ")[1]}
            {courseData.cid} - {courseData.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

type DeptProp = {
  dept: string;
};

export function Dept({ dept }: DeptProp) {
  getDepartments();
  const depts = JSON.parse(localStorage.getItem("departments") || "");
  console.log(depts);
  let deptData = null;
  // get details for passed department
  for (const d of depts) {
    if (d.dept.toLowerCase() == dept) {
      deptData = d;
      break;
    }
  }
  const deptDetails =
    deptData != null ? (
      <DeptDetails
        dept={deptData.dept}
        dean_fname={deptData.dean_fname}
        dean_lname={deptData.dean_lname}
        dean_email={deptData.dean_email}
      />
    ) : (
      <h1>No such department</h1>
    );

  return <div>{deptDetails}</div>;
}

function Departments() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Departments;
