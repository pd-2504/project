import React, { useState, useEffect } from "react";
import axios from "axios";
import KanbanCard from "./KanbanCard"; // Import the KanbanCard component
import "./App.css";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState(() => localStorage.getItem("groupBy") || "status");
  const [sortBy, setSortBy] = useState(() => localStorage.getItem("sortBy") || "priority");

  // Fetch data from the API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.quicksell.co/v1/internal/frontend-assignment"
      );
      setTickets(response.data.tickets);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Save state changes to localStorage
  const handleGroupByChange = (value) => {
    setGroupBy(value);
    localStorage.setItem("groupBy", value);
  };

  const handleSortByChange = (value) => {
    setSortBy(value);
    localStorage.setItem("sortBy", value);
  };

  // Define priority and status labels
  const priorityLabels = {
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
    0: "No priority",
  };

  const statusLabels = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
    canceled: "Canceled",
  };

  // Group tickets based on the selected grouping option
  const groupTickets = (tickets) => {
    if (!Array.isArray(tickets)) return {};

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
                <KanbanCard key={ticket.id} ticket={ticket} /> // Reuse KanbanCard component
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
