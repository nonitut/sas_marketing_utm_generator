const buttonBase = {
  width: "100%",
  padding: "0.8rem",
  marginBottom: "0.5rem",
  border: "none",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "1rem",
  cursor: "pointer",
};

const styles = {
  container: {
    width: "40vw",
    marginLeft: "60%",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2vw",
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    marginBottom: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  buttonGreen: { ...buttonBase, backgroundColor: "#4CAF50" },
  buttonBlue:  { ...buttonBase, backgroundColor: "#2196F3" },
  buttonGoogle:{ ...buttonBase, backgroundColor: "#DB4437" },
  link: {
    color: "#2196F3",
    cursor: "pointer",
    fontSize: "0.9rem",
    textAlign: "center",
    display: "block",
    marginBottom: "1rem",
  },
};

export default styles;