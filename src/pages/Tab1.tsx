import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { Button, Input, Table } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../context/auth';
import { database } from '../config/firebase.config';
import {ref, serverTimestamp, set} from "firebase/database";

const Tab1: React.FC = () => {
  const {realtimeEvent, id} = useAuth();
  const [inputName, setinputName] = useState("");
  const [inputValue, setinputValue] = useState(0);
  const [loadingTable, setloadingTable] = useState(false);
  const [disableButton, setdisableButton] = useState(false);

  interface Report {
    report_name: string,
    type_id: number,
    report_value: number,
    created_date: string
  } 

  const column = [
    {
      title: 'Report Name',
      dataIndex: 'report_name',
      key: 'report_name'
    },
    {
      title: 'Report type',
      dataIndex: 'type_id',
      key: 'type_id'
    },
    {
      title: 'Nominal',
      dataIndex: 'report_value',
      key: 'report_value',
      render: (data: Number, record: Report) => {
      return (
        <div>
          {record.type_id === 1  && <span >{`${data}`}</span>}
          {record.type_id === 2  && <span style={{color: "red"}}>{`${data}`}</span>}
        </div>
      );
      }
    },
    {
      title: 'Date',
      dataIndex: 'created_date',
      key: 'created_date',
      render: (data: string) => (formatDate(data))
    }
  ]

  const dataSource = [
    {
      "report_name": "jajan",
      "type_id": 2,
      "report_value": 5000,
      "created_date": "2025-03-01"
    },{
      "report_name": "jajan",
      "type_id": 2,
      "report_value": 5000,
      "created_date": "2025-03-01"
    },{
      "report_name": "Gaji",
      "type_id": 1,
      "report_value": 15000,
      "created_date": "2025-03-01"
    }
  ];

  const formatDate = (date: string) => {
    const format = dayjs(date).format("DD MMMM YYYY");
    return format;
  }

  const handleInput = async (type: number, name: string) => {
    try{
      setdisableButton(true);
      set(ref(database, `users/${id}`), {
        report_name: inputName,
        type_id: type,
        type_name: name,
        report_value: inputValue,
        created_date: serverTimestamp()
      });

      setinputName("");
      setinputValue(0);
    }
    catch(error){

    }
    finally{
      setdisableButton(false);
    }
    
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h5>Welcome, eson</h5>
        <h5>Current State Rp. 5000</h5>
        <div>
          <IonInput value={inputName} onIonInput={(e) => setinputName(e.detail.value!)} placeholder='income name'></IonInput> 
          <IonInput value={inputValue} type='number' onIonInput={(e) => setinputValue(parseInt(e.detail.value!))} placeholder='income value'></IonInput> 
          <div style={{display: "flex", alignItems:"center", marginTop: "20px"}}>
            <Button disabled={disableButton} onClick={() => handleInput(1, "income")} style={{ width: '50%', marginRight: "10px" }}>Income</Button>
            <Button disabled={disableButton} onClick={() => handleInput(2, "outcome")} style={{ width: '50%' }}>Outcome</Button>
          </div>
          <div>
            <h5 style={{marginLeft: "30%"}}>This month report</h5>
            <div style={{display: "flex", alignItems:"center", marginTop: "10px", marginBottom: "10px"}}>
              <span style={{width: '50%'}}>Income: Rp. 10000</span>
              <span style={{width: '50%'}}>Outcome: Rp. 5000</span>
            </div>
            <div >
              <Table 
                loading={loadingTable}
                columns={column}
                dataSource={dataSource}
              >
                
              </Table>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
