import axios from 'axios';

import { toast } from 'react-toastify';
import dayjs from 'dayjs';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getAllProperties = async () => {
  try {
    const response = await api.get('/residency/ranked', { timeout: 10000 });
    return response.data;
  } catch (error) {
    toast.error('Something went wrong');
    throw error;
  }
};


export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`, {
      timeout: 10 * 1000,
    });

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

export const createUser = async (email, token) => {
  try {
    await api.post(
      `/user/register`,
      { email },
    {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }}

  export const bookVisit = async (date, propertyId, email, token) => {
    try {
      console.log("Sending request with: ", { email, date, propertyId, token });
      await api.post(
        `/user/bookVisit/${propertyId}`,  // Send propertyId in the URL
        {
          email,
          date: dayjs(date).format("YYYY-MM-DD"),  // Ensure date is formatted properly
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Include the token for authentication
          },
        }
      );
    } catch (error) {
      toast.error("Something went wrong, Please try again.");
      throw error;
    }
  };

  
  
export const removeBooking = async (id, email, token) => {
  try {
    await api.post(
      `/user/removeBooking/${id}`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");

    throw error;
  }
};



export const toFav = async (id, email, token) => {
  try {
    await api.post(
      `/user/toFav/${id}`,  // Ensure this route works as expected in your backend
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (e) {
    console.error("Error updating favourites:", e);
    throw e;
  }
};



export const getAllFav = async (email, token) => {
  if(!token) return 
  try{

    const res = await api.post(
      `/user/allFav`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      
    return res.data["favResidenciesID"]

  }catch(e)
  {
    toast.error("Something went wrong while fetching favs");
    throw e
  }
} 


export const getAllBookings = async (email, token) => {
  
  if(!token) return 
  try {
    const res = await api.post(
      `/user/allBookings`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data["bookedVisits"];

    
  } catch (error) {
    toast.error("Something went wrong while fetching bookings");
    throw error
  }
}




export const createResidency = async (data, token) => {
  console.log(data)
  try{
    const res = await api.post(
      `/residency/create`,
      {
        data
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }catch(error)
  {
    throw error
  }
}

export const getAgentDetails = async (agentId) => {
  try {
    const response = await api.get(`/agents/${agentId}`);
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch agent details");
    throw error;
  }
};


export const getRankedProperties = async () => {
  try {
    const response = await api.get('/residency/ranked', { timeout: 10000 }); // ✅ Fetches ranked properties
    return response.data;
  } catch (error) {
    toast.error('Something went wrong while fetching ranked properties');
    throw error;
  }
};



export const compareProperties = async (selectedProperties) => {
  try {
    if (!Array.isArray(selectedProperties) || selectedProperties.length < 2) {
      console.error("❌ selectedProperties is invalid:", selectedProperties);
      throw new Error("Invalid property list format");
    }

    console.log("📤 Sending API Request with:", JSON.stringify(selectedProperties)); // Debugging

    const response = await axios.post("http://127.0.0.1:5000/compare", 
      { property_ids: selectedProperties }, // ✅ This should be here, not in ComparePage.jsx
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Comparison API Error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const sendMessageToChatbot = async (message) => {
  try {
    if (!message || typeof message !== "string") {
      console.error("❌ Invalid message format:", message);
      throw new Error("Message must be a non-empty string");
    }

    console.log("📤 Sending message to chatbot:", message);

    const response = await axios.post("http://localhost:8000/api/chatbot/chat", 
      { message }, 
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ Chatbot API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Chatbot API Error:", error.response ? error.response.data : error.message);
    toast.error("Chatbot error: Failed to get a response.");
    return { reply: "Sorry, I couldn't connect to the bot." }; // ✅ Prevent UI crash
  }
};
