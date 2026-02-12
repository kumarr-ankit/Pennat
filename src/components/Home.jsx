import NavbarPage from "./NavbarPage";
import ArticlePage from "./ArticlePage";
import AddArticle from "./AddArticle";
import { useState } from "react";
import FieldInput from "./ui/FieldInput";

function Home() {
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <div className="w-full box-content min-h-screen ">
      <NavbarPage />

      <div>
        <div
          onClick={() => {
            setShowPopUp((p) => !p);
          }}
          className="  mx-auto md:w-[82%] fixed top-14 left-0 right-0 md:top-0 "
        >
          {!showPopUp && <AddArticle />}
        </div>
        <div>
          <FieldInput showPopUp={showPopUp} setShowPopUp={setShowPopUp} />
        </div>
      </div>
      <div className="md:mt-20  mt-32 box-content">
        <ArticlePage />
      </div>
    </div>
  );
}

export default Home;
