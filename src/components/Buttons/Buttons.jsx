import "./Buttons.css";

const Buttons = ({ value, className, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
};

export default Buttons;
