import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useState, useEffect, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enIN from 'date-fns/locale/en-US';
import './Events.css';
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TimePicker from 'react-time-picker';
import { Col, Row } from 'react-bootstrap';
import { FaCalendarPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';



function MyVerticallyCenteredModal(props) {
  const [isEditing, setIsEditing] = useState(false);
  const profile = useSelector((state) => state.profile);
  const [newEvent, setNewEvent] = useState({
    title: "", start: "", end: "", startTime: "00:00",
    endTime: "00:00", picture: "", cName: "",
    cNumber: "", cEmail: "", location: ""
  });
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState([props.selectedEvent])
  console.log("edit modal l", props.isEditing);


  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // When the file is loaded, set the data URL in formData
        setNewEvent({ ...newEvent, picture: reader.result });
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };



  const handleAddEvent = () => {
    const { title, start, end, startTime, endTime, picture, cName, cNumber, cEmail,location } = newEvent;

    if (!title || !start || !end || !picture) {
      alert("Please provide title, start date, end date and image");
      return;
    }

    const formattedStart = format(new Date(start), "yyyy-MM-dd");
    const formattedEnd = format(new Date(end), "yyyy-MM-dd");

    const eventData = {
      userId: profile._id,
      title,
      start: formattedStart,
      end: formattedEnd,
      startTime,
      endTime,
      picture,
      cName,
      cNumber,
      cEmail,
      location,
      department: profile.department
    };
    console.log('eventData', eventData)

    fetch("http://localhost:5000/events/createEvent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((createdEvent) => {
        setAllEvents([...allEvents, createdEvent]);
        window.location.reload();

        setNewEvent({ title: "", start: "", end: "", startTime: "", endTime: "", picture: null, cEmail: "",cName: "", cNumber: "", location: "" });
      })
      .catch((error) => console.error("Error creating event:", error));
  };


  const handleEditEvent = () => {
    console.log('Editing Event')
    const { title, start, end, startTime, endTime, picture, cName, cNumber, cEmail,location } = newEvent;
    console.log("props selected event", props.selectedEvent)
    const eventId = props.selectedEvent._id;

    if (!title || !start || !end) {
      alert("Please provide title, start date, and end date.");
      return;
    }

    try {
      const formattedStart = format(new Date(start), "yyyy-MM-dd");
      const formattedEnd = format(new Date(end), "yyyy-MM-dd");


      const updatedEvent = {
        title: title,
        start: formattedStart,
        end: formattedEnd,
        startTime,
        endTime,
        picture,
        cName,
        cNumber,
        cEmail,
        location
      };

      const jsonEventData = JSON.stringify(updatedEvent);

      fetch(`http://localhost:5000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonEventData,
      })
        .then(() => {
          const updatedEvents = allEvents.map((event) =>
            event._id === eventId ? updatedEvent : event
          );

          setAllEvents(updatedEvents);
          setSelectedEvent(null);
          props.onHide();
          toast.success("Event updated successfully.");
          window.location.reload();
        })
        .catch((error) => console.error("Error updating event:", error));
    } catch (jsonError) {
      console.error("JSON serialization error:", jsonError);
      alert("Error updating event: JSON serialization error");
    }
  };

  const handleDateChange = (date, field) => {
    if (props.isEditing) {
      const updatedEvent = { ...newEvent };
      updatedEvent[field] = date;
      setNewEvent(updatedEvent);
      setIsEditing(true)
    } else {
      setNewEvent({ ...newEvent, [field]: date });
    }
  };

  const handleTimeChange = (time, field) => {
    const updatedEvent = { ...newEvent };
    updatedEvent[field] = time;
    setNewEvent(updatedEvent);
  };



  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{ backgroundColor: '#f5dad2' }} closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {console.log("edit modal header", props.isEditing)}
          {props.isEditing ? "Edit Event" : "Add Event"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ display: 'flex', gap: '2em', backgroundColor: '#eaf6ff' }}>
        <Col>
          <Row style={{ padding: '0px 5px' }}>
            <input
              type="text"
              placeholder="Add/Edit Title"
              style={{ width: "100%", padding: "0.5em", borderRadius: "10px" }}
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <br />
            <br />
            <label htmlFor={newEvent.picture}>Insert a Picture:-</label>
            <br />
            <input type="file" name={newEvent.picture}
              style={{ width: '60%' }}
              onChange={handleImageChange} />


            <input
              type="text"
              placeholder="Enter Coordinator Name"
              style={{ width: "100%", padding: "0.5em", borderRadius: "10px" }}
              value={newEvent.cName}
              onChange={(e) =>
                setNewEvent({ ...newEvent, cName: e.target.value })
              }
            />



          </Row>



        </Col>




        <Col>
          <DatePicker
            placeholderText="Start Date"
            style={{ marginRight: "10px", padding: "0.5em" }}
            selected={newEvent.start}
            onChange={(date) => handleDateChange(date, "start")}
          />
          <br /><br />
          <input type="time" id="appt" name="startTime" value={newEvent.startTime} onChange={(e) =>
            setNewEvent({ ...newEvent, startTime: e.target.value })
          } />
          <br /><br />
          {/* <label htmlFor="eventType">Event Type:&nbsp;&nbsp;&nbsp;</label>
            <select id="eventType" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select> */}
          <input
            type="number"
            placeholder="Enter Coordinator Contact Number"
            style={{ width: "100%", padding: "0.5em", borderRadius: "10px" }}
            value={newEvent.cNumber}
            onChange={(e) =>
              setNewEvent({ ...newEvent, cNumber: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Enter event location"
            style={{ width: "100%", padding: "0.5em", borderRadius: "10px" }}
            value={newEvent.location}
            onChange={(e) =>
              setNewEvent({ ...newEvent, location: e.target.value })
            }
          />

        </Col>


        <Col>
          <Col>
            <DatePicker
              placeholderText="End Date"
              style={{ padding: "0.5em" }}
              selected={newEvent.end}
              onChange={(date) => handleDateChange(date, "end")}
            />
            <br /><br />
            <input type="time" id="appt" name="endTime" value={newEvent.endTime} onChange={(e) =>
              setNewEvent({ ...newEvent, endTime: e.target.value })
            } />
            <input
              type="email"
              placeholder="Enter Coordinator Email"
              style={{ width: "100%", padding: "0.5em", borderRadius: "10px" }}
              value={newEvent.cEmail}
              onChange={(e) =>
                setNewEvent({ ...newEvent, cEmail: e.target.value })
              }
            />
          </Col>

        </Col>
        {/* <Row>
          <Col>
            <label htmlFor="eventType">Event Type:</label>
            <select id="eventType" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </Col>
        </Row> */}
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: '#f5dad2' }}>
        <Button
          onClick={props.isEditing ? handleEditEvent : handleAddEvent}
        >
          {props.isEditing ? "Edit Event" : "Add Event"}
        </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>

    </Modal>
  );
}


const locales = {
  "en-IN": enIN,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Events() {
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "", startTime: "", endTime: "", type: "" });
  const [allEvents, setAllEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const calendarRef = useRef(null);
  const profile = useSelector((state) => state.profile);

  // const gapi = window.gapi;
  // const google = window.google;

  // const CLIENT_ID = '221910855256-3ra04lqbdb4elusir5clvsail6ldum53.apps.googleusercontent.com';
  // const API_KEY = 'AIzaSyCduY-X8qZOq43I8zwsHlf2WWZ1ewDjpdc';
  // const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  // const SCOPES = "https://www.googleapis.com/auth/calendar";
  // const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';



  let admin;
  if (profile.profileLevel === 0 || profile.profileLevel === 1) {
    admin = true;
  }

  const handleClickOutsideCalendar = (event) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target) &&
      !event.target.closest(".modal-open")
    ) {
      setIsEditing(false);
      console.log('edit ', isEditing);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the calendar
    window.addEventListener("click", handleClickOutsideCalendar);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutsideCalendar);
    };
  }, []);


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete') {
        // Check if an event is selected
        if (selectedEvent) {
          handleDeleteEvent();
        }
      }
    };

    // Add event listener for the delete key
    document.addEventListener('keydown', handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEvent]);




  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch("http://localhost:5000/events")
      .then((response) => response.json())
      .then((data) => {
        // Convert start and end dates to JavaScript Date objects
        const eventsWithDates = data.map((event) => ({
          ...event,
          start: new Date(event.start), // Convert start date to Date object
          end: new Date(event.end),     // Convert end date to Date object
        }));

        // Add unique IDs to each event
        const eventsWithIds = eventsWithDates.map((event, index) => ({
          ...event,
          id: index + 1, // You can use a better method to generate unique IDs
        }));

        // // Filter events based on profile department
        // const filteredEvents = eventsWithIds.filter((event) => {
        //   if (event.department === 'All' || event.type === 'Public' || profile.profileLevel === 0) {
        //     return true; // Return true for all events if department is 'All'
        //   } else {
        //     return event.department === profile.department;
        //   }
        // });

        setAllEvents(eventsWithIds);
      })
      .catch((error) => console.error("Error fetching events:", error));
  };




  function handleEventClick(event) {
    setSelectedEvent(event);
    console.log("selected event", selectedEvent)
    setIsEditing(true);
    console.log("edit", isEditing)
    setNewEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      startTime: event.startTime,
      endTime: event.endTime,
      picture: event.picture,
      cName: event.cName,
      cNumber: event.cNumber,
      cEmail: event.cEmail
    });
    setSelectedEventDetails(event);
  }



  const handleDeleteEvent = (e) => {
    const eventId = selectedEvent._id;
    console.log("id", eventId);
    fetch(`http://localhost:5000/events/${eventId}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Remove the event from the events array
        const updatedEvents = allEvents.filter(
          (event) => event._id !== eventId
        );

        setAllEvents(updatedEvents);
        setSelectedEvent(null);
        setIsEditing(false);

        toast.success('Event deleted successfully.');
      })
      .catch((error) => console.error('Error deleting event:', error));

  };
  const addToGoogleCalendar = () => {
    console.log('handle add to google calendar')

    // gapi.load('client:auth2', () => {
    //   console.log('loaded client')

    //   gapi.client.init({
    //     apiKey: API_KEY,
    //     clientId: CLIENT_ID,
    //     discoveryDocs: DISCOVERY_DOC,
    //     scope: SCOPES,
    //   })

    //   gapi.client.load('calendar', 'v3', () => console.log('bam!'))

    //   gapi.auth2.getAuthInstance().signIn()
    //   .then(() => {

    //     var event = {
    //       'summary': 'Awesome Event!',
    //       'location': '800 Howard St., San Francisco, CA 94103',
    //       'description': 'Really great refreshments',
    //       'start': {
    //         'dateTime': '2024-02-15T09:00:00-07:00',
    //         'timeZone': 'America/Los_Angeles'
    //       },
    //       'end': {
    //         'dateTime': '2020-06-28T17:00:00-07:00',
    //         'timeZone': 'America/Los_Angeles'
    //       },
    //       'recurrence': [
    //         'RRULE:FREQ=DAILY;COUNT=2'
    //       ],
    //       'attendees': [
    //         {'email': 'lpage@example.com'},
    //         {'email': 'sbrin@example.com'}
    //       ],
    //       'reminders': {
    //         'useDefault': false,
    //         'overrides': [
    //           {'method': 'email', 'minutes': 24 * 60},
    //           {'method': 'popup', 'minutes': 10}
    //         ]
    //       }
    //     }

    //     var request = gapi.client.calendar.events.insert({
    //       'calendarId': 'primary',
    //       'resource': event,
    //     })

    //     request.execute(event => {
    //       console.log(event)
    //       window.open(event.htmlLink)
    //     })



    //   })
    // })
  }



  return (
    <div className="Events">
      <h1 style={{ color: '#174873' }}>Event Calendar</h1>
      <div ref={calendarRef}>
        <MyVerticallyCenteredModal
          show={modalShow}
          isEditing={isEditing}
          selectedEvent={selectedEvent}
          onHide={() => {
            setModalShow(false);
            setSelectedEventDetails(null);
          }}
        />
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '60vh', margin: "50px" }}
          selectable
          onSelectEvent={handleEventClick}
        />
        {admin && (
          <Button
            className="add-event-button"
            variant="primary"
            onClick={() => setModalShow(true)}
            style={{
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              position: 'absolute',
              backgroundColor: '#174873'
            }}
          >
            <FaCalendarPlus />
          </Button>
        )}

        {selectedEventDetails && (
          <Modal
            show={true}
            onHide={() => setSelectedEventDetails(null)}
            size="lg"
          >
            <Modal.Header style={{ backgroundColor: '#f5dad2' }} closeButton>
              <Modal.Title>Event Details</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#eaf6ff' }}>
              <div style={{ display: 'flex' }}>
                <div>
                  <p><span style={{ fontWeight: '500' }}>Title:</span> {selectedEventDetails.title}</p>
                  <p><span style={{ fontWeight: '500' }}>Start Date:</span> {selectedEventDetails.start.toDateString()}</p>
                  <p><span style={{ fontWeight: '500' }}>End Date:</span> {selectedEventDetails.end.toDateString()}</p>
                  <p><span style={{ fontWeight: '500' }}>Start Time:</span>  {selectedEventDetails.startTime} hrs</p>
                  <p><span style={{ fontWeight: '500' }}>End Time:</span> {selectedEventDetails.endTime} hrs</p>
                  <p><span style={{ fontWeight: '500' }}>Coordinator Name:</span> {selectedEventDetails.cName}</p>
                  <p><span style={{ fontWeight: '500' }}>Coordinator Number:</span> {selectedEventDetails.cNumber}</p>
                  <p><span style={{ fontWeight: '500' }}>Coordinator Email:</span> {selectedEventDetails.cEmail}</p>
                  <p><span style={{ fontWeight: '500' }}>Location:</span> {selectedEventDetails.location}</p>
                </div>
                <img src={selectedEventDetails.picture} style={{ height: '200px', width: '300px', marginLeft: 'auto' }} />
              </div>
              <div style={{ display: 'flex', gap: '2vw' }}>
                <Button variant="success" onClick={addToGoogleCalendar}>
                  Add To Google Calendar
                </Button>
                {(selectedEventDetails.userId === profile._id || profile.profileLevel === 0) && <div className="event-edit-delete">

                  <Button variant="primary" onClick={() => setModalShow(true)}>

                    Edit Event
                  </Button>
                  <Button variant="danger" onClick={() => {
                    handleDeleteEvent();
                    setSelectedEventDetails(null)
                  }}>

                    Delete Event
                  </Button>
                </div>}
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </div>
  );
}


export default Events;