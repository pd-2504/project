import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState(() => {
    // Retrieve saved grouping option from localStorage or default to "status"
    return localStorage.getItem("groupBy") || "status";
  });
  const [sortBy, setSortBy] = useState(() => {
    // Retrieve saved sorting option from localStorage or default to "priority"
    return localStorage.getItem("sortBy") || "priority";
  });

  // Fetch data from the API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.quicksell.co/v1/internal/frontend-assignment"
      );
      console.log(response.data); // Log the response to check the format
      setTickets(response.data.tickets); // Set tickets to the API response
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Save grouping to localStorage whenever it changes
  const handleGroupByChange = (value) => {
    setGroupBy(value);
    localStorage.setItem("groupBy", value); // Save to localStorage
  };

  // Save sorting to localStorage whenever it changes
  const handleSortByChange = (value) => {
    setSortBy(value);
    localStorage.setItem("sortBy", value); // Save to localStorage
  };

  // Define priority labels
  const priorityLabels = {
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
    0: "No priority",
  };

  // Define status labels
  const statusLabels = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
    canceled: "Canceled",
  };

  // Group tickets based on the selected grouping option
  const groupTickets = (tickets) => {
    if (!Array.isArray(tickets)) return {}; // Ensure tickets is an array

    if (groupBy === "status") {
      return tickets.reduce((acc, ticket) => {
        if (!acc[ticket.status]) {
          acc[ticket.status] = [];
        }
        acc[ticket.status].push(ticket);
        return acc;
      }, {});
    } else if (groupBy === "priority") {
      return tickets.reduce((acc, ticket) => {
        if (!acc[ticket.priority]) {
          acc[ticket.priority] = [];
        }
        acc[ticket.priority].push(ticket);
        return acc;
      }, {});
    } else if (groupBy === "user") {
      return tickets.reduce((acc, ticket) => {
        if (!acc[ticket.user]) {
          acc[ticket.user] = [];
        }
        acc[ticket.user].push(ticket);
        return acc;
      }, {});
    }
  };

  // Sort tickets based on the selected sorting option
  const sortTickets = (tickets) => {
    if (sortBy === "priority") {
      return [...tickets].sort((a, b) => b.priority - a.priority);
    } else if (sortBy === "title") {
      return [...tickets].sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  // Get grouped and sorted tickets
  const groupedTickets = groupTickets(tickets);

  return (
    <div className="kanban-board">
      <div className="controls">
        <div className="group-by">
          <label>Grouping:</label>
          <select
            value={groupBy}
            onChange={(e) => handleGroupByChange(e.target.value)}
          >
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="sort-by">
          <label>Ordering:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortByChange(e.target.value)}
          >
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      <div className="kanban-columns">
        {Object.keys(groupedTickets)
          .sort((a, b) => b - a) // Sort groups by priority level descending
          .map((group) => (
            <div className="kanban-column" key={group}>
              <h3>{groupBy === "status" ? statusLabels[group] : priorityLabels[group]}</h3>
              {sortTickets(groupedTickets[group]).map((ticket) => (
                <div className="kanban-card" key={ticket.id}>
                  <div className="ticket-header">
                    <span className="ticket-id">{ticket.id}</span>
                    <img
                      src={`https://api.adorable.io/avatars/50/${ticket.user}.png`}
                      alt={ticket.user}
                      className="user-icon"
                    />
                  </div>
                  <h4>{ticket.title}</h4>
                  <div className="ticket-footer">
                    <span className="ticket-feature">
                      <i className="icon-feature" /> Feature Request
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
