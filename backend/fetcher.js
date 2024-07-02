const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/get-notifications-for-user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({user_id: target_user_id}),    // replace target_user_id variable with the variable
          }                                                     // na nag hohold ng id ng user
        );
        const data = await response.json();

        // variable "data" now contains yung rows ng notifs for that user
        return data
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    };