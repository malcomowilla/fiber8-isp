const TrackEvent= ({eventType, button_name, children}) => {
  const subdomain = window.location.hostname.split('.')[0]

  const handleClick = () => {
    fetch("/api/track_ad_event", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Subdomain": subdomain,
      },
      body: JSON.stringify({
        event_type: eventType,
        button_name: button_name,
      })
    }).then(res => console.log("Event tracked"))
      .catch(err => console.error(err));
  }

  return (
    <button onClick={handleClick}>
      {children}
    </button>
  )
}

export default TrackEvent
