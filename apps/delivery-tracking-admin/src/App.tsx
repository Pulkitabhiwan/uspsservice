import React, { useEffect, useState } from "react";
import { Admin, DataProvider, Resource } from "react-admin";
import buildGraphQLProvider from "./data-provider/graphqlDataProvider";
import { theme } from "./theme/theme";
import Login from "./Login";
import "./App.scss";
import Dashboard from "./pages/Dashboard";
import { DeliveryList } from "./delivery/DeliveryList";
import { DeliveryCreate } from "./delivery/DeliveryCreate";
import { DeliveryEdit } from "./delivery/DeliveryEdit";
import { DeliveryShow } from "./delivery/DeliveryShow";
import { TrackingList } from "./tracking/TrackingList";
import { TrackingCreate } from "./tracking/TrackingCreate";
import { TrackingEdit } from "./tracking/TrackingEdit";
import { TrackingShow } from "./tracking/TrackingShow";
import { ContactInfoList } from "./contactInfo/ContactInfoList";
import { ContactInfoCreate } from "./contactInfo/ContactInfoCreate";
import { ContactInfoEdit } from "./contactInfo/ContactInfoEdit";
import { ContactInfoShow } from "./contactInfo/ContactInfoShow";
import { UserList } from "./user/UserList";
import { UserCreate } from "./user/UserCreate";
import { UserEdit } from "./user/UserEdit";
import { UserShow } from "./user/UserShow";
import { jwtAuthProvider } from "./auth-provider/ra-auth-jwt";

const App = (): React.ReactElement => {
  const [dataProvider, setDataProvider] = useState<DataProvider | null>(null);
  useEffect(() => {
    buildGraphQLProvider
      .then((provider: any) => {
        setDataProvider(() => provider);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);
  if (!dataProvider) {
    return <div>Loading</div>;
  }
  return (
    <div className="App">
      <Admin
        title={"DeliveryTracking"}
        dataProvider={dataProvider}
        authProvider={jwtAuthProvider}
        theme={theme}
        dashboard={Dashboard}
        loginPage={Login}
      >
        <Resource
          name="Delivery"
          list={DeliveryList}
          edit={DeliveryEdit}
          create={DeliveryCreate}
          show={DeliveryShow}
        />
        <Resource
          name="Tracking"
          list={TrackingList}
          edit={TrackingEdit}
          create={TrackingCreate}
          show={TrackingShow}
        />
        <Resource
          name="ContactInfo"
          list={ContactInfoList}
          edit={ContactInfoEdit}
          create={ContactInfoCreate}
          show={ContactInfoShow}
        />
        <Resource
          name="User"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          show={UserShow}
        />
      </Admin>
    </div>
  );
};

export default App;
