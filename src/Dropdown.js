import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import BidCreator from './BidCreator';
import Bidder from './Bidder';

const App = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSelect = (eventKey) => {
    setSelectedRole(eventKey);
  };

  return (
    <div className="container mt-5">
      <h2>Select Role</h2>
      <DropdownButton
        id="dropdown-basic-button"
        title={selectedRole ? selectedRole : 'Select Role'}
        onSelect={handleSelect}
      >
        <Dropdown.Item eventKey="Bid Creator">Bid Creator</Dropdown.Item>
        <Dropdown.Item eventKey="Bidder">Bidder</Dropdown.Item>
      </DropdownButton>

      {selectedRole === 'Bid Creator' && (
        <div className="mt-4">
          <BidCreator />
        </div>
      )}

      {selectedRole === 'Bidder' && (
        <div className="mt-4">
          <Bidder />
        </div>
      )}
    </div>
  );
};

export default App;
