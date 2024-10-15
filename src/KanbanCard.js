import React from "react";

const KanbanCard = ({ ticket }) => {
  return (
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
  );
};

export default KanbanCard;
