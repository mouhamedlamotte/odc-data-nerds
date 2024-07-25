let debug = false;
if (process.env.NODE_ENV !== "production") {
   debug = true;
  console.log("Debug mode is on");
}
export const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/odc-dev-data.appspot.com/o/students%2Favatars%2Fdefault-person.png?alt=media&token=12f6a80a-395c-4abf-bd8f-c575ea922dbc"

export   const defaultChoice = {
    id: 0,
    firstName: "qui est cette personne",
    lastName: "mystérieuse ?",
    avatar: defaultAvatar,
    active: true,
  };


export const kdebug =(message) =>{
  if(debug){
    console.log(message)
  }
}