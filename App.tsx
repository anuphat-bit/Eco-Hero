// เปลี่ยนฟังก์ชัน addLog เป็นแบบ async เพื่อให้รอการส่งข้อมูลไปที่ Google Sheets
  const addLog = async (type: LogType, sheets: number) => {
    if (!currentUser) return;

    let paperUsed = 0;
    let ecoPoints = 0;
    const pointsConfig = ECO_POINTS_CONFIG[type];

    switch (type) {
      case 'Single-Sided':
      case 'Copy':
      case 'Envelope':
        paperUsed = sheets;
        ecoPoints = pointsConfig.pointsPerSheet * paperUsed;
        break;
      case 'Double-Sided':
        paperUsed = Math.ceil(sheets / 2);
        ecoPoints = pointsConfig.pointsPerSheet * paperUsed;
        break;
      case 'Digital':
      case 'Reuse':
        paperUsed = 0;
        ecoPoints = pointsConfig.pointsPerSheet * sheets;
        break;
    }

    const newLogData: LogEntry = {
      id: Date.now().toString(),
      userId: currentUser.id,
      departmentId: currentUser.departmentId,
      type,
      sheets,
      paperUsed,
      ecoPoints,
      timestamp: new Date().toISOString(),
    };

    // คำนวณคะแนนใหม่
    const updatedPoints = currentUser.points + ecoPoints;

    try {
      // --- 1. ส่งคะแนนใหม่กลับไปบันทึกใน Google Sheets (สำคัญมาก) ---
      await fetch(`https://sheetdb.io/api/v1/1kh0wf5fvqs3w/id/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            points: updatedPoints
          }
        })
      });

      // --- 2. อัปเดตข้อมูลที่หน้าจอแอป ---
      setLogs((prevLogs) => [...prevLogs, newLogData]);
      
      setUsers(prevUsers => prevUsers.map(u => 
        u.id === currentUser.id ? { ...u, points: updatedPoints } : u
      ));

      // อัปเดตตัว currentUser ที่กำลังล็อกอินอยู่ด้วย เพื่อให้หน้า Dashboard โชว์คะแนนใหม่ทันที
      setCurrentUser(prev => prev ? { ...prev, points: updatedPoints } : null);

      console.log("บันทึกข้อมูลลง Google Sheets เรียบร้อย!");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
      alert("ไม่สามารถบันทึกคะแนนลง Google Sheets ได้ โปรดลองอีกครั้ง");
    }
  };
