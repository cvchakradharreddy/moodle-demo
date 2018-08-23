import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
//import axios from "axios";
import $ from "jquery";
import ReactHtmlParser from "react-html-parser";

class App extends Component {
  static moodleUrl = "http://localhost/moodle/webservice/rest/server.php?";
  static studentToken = "1313530e5a0b1747af5d0c1391d1afcc";
  static adminToken_moodle_mobile_app = "61685e4186a4a0d7558bb0494fee8941";
  static adminExtendedToken = "c558fd7eb35e8200ea40b53d73d0b7dd";
  static studentRoleId = 5;

  constructor() {
    super();
    this.state = {
      userId: 3,
      userName: "SAN FRAN BROKER",
      availableCoursesList: [],
      enrolledCoursesList: [],
      selectedCourseIdToEnroll: 0,
      newUser: {
        username: "",
        password: "",
        createpassword: 0,
        firstname: "",
        lastname: "",
        email: ""
      }
    };

    this.loadAvailableCourses = this.loadAvailableCourses.bind(this);
    this.loadEnrolledCourses = this.loadEnrolledCourses.bind(this);
    this.fetchAvailableCourses = this.fetchAvailableCourses.bind(this);
    this.fetchEnrolledCourses = this.fetchEnrolledCourses.bind(this);
    this.selectAvailableCourse = this.selectAvailableCourse.bind(this);
    this.enrollUserForSelectedCourse = this.enrollUserForSelectedCourse.bind(
      this
    ); 
    this.createUser = this.createUser.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addCompletionStatus = this.addCompletionStatus.bind(this);
  }

  componentDidMount() {
    this.fetchAvailableCourses();
    this.fetchEnrolledCourses();
  }

  render() {
    return (
      <div>
        <header className="jumbotron text-center App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>My CE Portal | SLACAL</h1>
          <h4>
            Welcome{" "}
            <span className="text-primary"> {this.state.userName} </span>
          </h4>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-sm-6 text-right">
              <h5>Available Courses</h5>
            </div>
            <div className="col-sm-6 text-left">
              <form onSubmit={this.enrollUserForSelectedCourse}>
                <div className="row">
                  <div className="col-sm-8">
                    <select
                      value={this.state.selectedCourseIdToEnroll}
                      onChange={this.selectAvailableCourse}
                    >
                      {this.state.availableCoursesList.map(course => (
                        <option value={course.id} key={course.id}>
                          {course.fullname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-4 text-right">
                    <input
                      className="btn btn-primary"
                      type="submit"
                      value="Enroll"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 text-right">
              <h5>Enrolled Courses</h5>
            </div>
            <div className="col-sm-6 text-left">
              <ul>
                {this.state.enrolledCoursesList.map(course => (
                  <li key={course.id}>
                    {course.fullname}
                    <div
                      className={
                        course.completionstatus.completed
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      <span>
                        Status:{" "}
                        {course.completionstatus.completed
                          ? "Completed"
                          : "Not completed"}
                      </span>
                      <ul
                        dangerouslySetInnerHTML={{
                          __html: course.completionstatus.completions
                            ? course.completionstatus.completions
                                .map(cm => {
                                  return cm.type === 4
                                    ? "<li class='text-dark'>Topic: " +
                                        cm.details.criteria +
                                        " Completed: " +
                                        (cm.complete ? "Yes" : "No") +
                                        "</li>"
                                    : "";
                                })
                                .join("")
                            : ""
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 text-right">
              <h5>Create User</h5>
            </div>
            <div className="col-sm-6 text-left">
              <form onSubmit={this.createUser}>
                <div className="row">
                  <div className="col-sm-6">
                    <label>
                      Username: &nbsp;
                      <input
                        type="text"
                        name="username"
                        defaultValue={this.state.newUser.username}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    <label>
                      Password: &nbsp;
                      <input
                        type="text"
                        name="password"
                        defaultValue={this.state.newUser.password}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    <label>
                      Firstname: &nbsp;
                      <input
                        type="text"
                        name="firstname"
                        defaultValue={this.state.newUser.firstname}
                        onChange={this.handleInputChange}
                      />
                    </label>
                  </div>
                  <div className="col-sm-6">
                    <label>
                      Lastname: &nbsp;
                      <input
                        type="text"
                        name="lastname"
                        defaultValue={this.state.newUser.lastname}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    <label>
                      User Email: &nbsp;
                      <input
                        type="text"
                        name="email"
                        defaultValue={this.state.newUser.email}
                        onChange={this.handleInputChange}
                      />
                    </label>
                    <input
                      className="btn btn-primary"
                      type="submit"
                      value="Create"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    let prevNewUser = { ...this.state.newUser };
    prevNewUser[name] = value;
    this.setState({
      newUser: prevNewUser
    });
  }

  selectAvailableCourse(event) {
    this.setState({ selectedCourseIdToEnroll: event.target.value * 1 });
  }

  loadAvailableCourses(data) {
    if (data && data.courses) {
      data.courses.shift();
      this.setState({
        availableCoursesList: data.courses,
        selectedCourseIdToEnroll: data.courses[0].id
      });
    }
  }

  loadEnrolledCourses(courses) {
    if (courses) {
      this.addCompletionStatus(courses);
    }
  }

  fetchAvailableCourses() {
    var URLParams = $.param({
      wsfunction: "core_course_get_courses_by_field",
      wstoken: App.studentToken,
      moodlewsrestformat: "json"
    });
    fetch(App.moodleUrl + URLParams)
      .then(response => response.json())
      .then(
        function(result) {
          if (result) {
            this.loadAvailableCourses(result);
          }
        }.bind(this)
      )
      .catch(function(err) {
        console.error(err);
      });
  }

  fetchEnrolledCourses() {
    var URLParams = $.param({
      wsfunction: "core_enrol_get_users_courses",
      wstoken: App.studentToken,
      moodlewsrestformat: "json",
      userid: this.state.userId
    });
    fetch(App.moodleUrl + URLParams)
      .then(response => response.json())
      .then(
        function(result) {
          if (result) {
            this.loadEnrolledCourses(result);
          }
        }.bind(this)
      )
      .catch(function(err) {
        console.error(err);
      });
  }

  enrollUserForSelectedCourse(event) {
    var URLParams = $.param({
      wsfunction: "enrol_manual_enrol_users",
      wstoken: App.adminExtendedToken,
      moodlewsrestformat: "json",
      "enrolments[0][roleid]": App.studentRoleId,
      "enrolments[0][userid]": this.state.userId,
      "enrolments[0][courseid]": this.state.selectedCourseIdToEnroll,
      "enrolments[0][timestart]": 0,
      "enrolments[0][timeend]": 0,
      "enrolments[0][suspend]": 0
    });
    fetch(App.moodleUrl + URLParams)
      .then(response => response.json())
      .then(function(result) {
        console.log("Succesfully Enrolled!");
        this.fetchEnrolledCourses();
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  createUser(event) {
    let newUser = this.state.newUser;
    var URLParams = $.param({
      wsfunction: "core_user_create_users",
      wstoken: App.adminExtendedToken,
      moodlewsrestformat: "json",
      "users[0][username]": newUser.username,
      "users[0][password]": newUser.password,
      "users[0][createpassword]": newUser.createpassword,
      "users[0][firstname]": newUser.firstname,
      "users[0][lastname]": newUser.lastname,
      "users[0][email]": newUser.email
    });
    fetch(App.moodleUrl + URLParams)
      .then(response => response.json())
      .then(response => {
        debugger;
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
  }

  addCompletionStatus(courses) {
    courses.map(course => {
      course.completionstatus = {};
      var URLParams = $.param({
        wsfunction: "core_completion_get_course_completion_status",
        wstoken: App.adminToken_moodle_mobile_app,
        moodlewsrestformat: "json",
        courseid: course.id,
        userid: this.state.userId
      });
      fetch(App.moodleUrl + URLParams)
        .then(response => response.json())
        .then(response => {
          course.completionstatus = !response.errorcode
            ? response.completionstatus
            : {};
          this.setState({
            enrolledCoursesList: courses
          });
        })
        .catch(error => {
          console.error(error);
        });
    });
  }
}

export default App;
