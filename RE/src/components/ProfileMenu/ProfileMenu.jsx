import React from 'react';
import { Avatar, Menu } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = ({ user, logout }) => {
  const navigate = useNavigate();

  // Check if user object exists
  if (!user) return <div>User not logged in</div>;

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        {/* Avatar component with manually enforced circular shape */}
        <Avatar
          src={user.picture?.replace('s96-c', 's128-c')} // Adjust image URL
          alt="user image"
          radius="50%" // Enforce circle shape
          size="40px"
          style={{ cursor: 'pointer' }} // Make it clickable
        />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => navigate('./favourites', { replace: true })}>
          Favourites
        </Menu.Item>
        <Menu.Item onClick={() => navigate('./bookings', { replace: true })}>
          Bookings
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            localStorage.clear();
            logout();
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ProfileMenu;
