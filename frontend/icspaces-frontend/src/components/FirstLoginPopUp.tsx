import React, { useState, useEffect } from "react";

import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FirstLogInPopUp = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [userType, setUserType] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(null);
  const [email, setEmail] = useState(null);
  const [studentNumber, setStudentNumber] = useState<string | null>("");
  const [org, setOrg] = useState<string | null>("");
  const [course, setCourse] = useState<string | null>("");
  const [college, setCollege] = useState<string | null>("");
  const [department, setDepartment] = useState<string | null>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user type from server when component mounts
    fetch("http://localhost:3001/get-profile", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserType(data.data.usertype);
          setFirstName(data.data.firstName);
          setEmail(data.data.email);
          setIsFirstLogin(data.data.isFirstLogin);
        }
      });
  }, []);

  useEffect(() => {
    if (isFirstLogin === 1) {
      navigate("/homepage", { replace: true });
    }
  }, [isFirstLogin]);

  const closeModal = () => {
    setIsOpen(false);
  };

  // Update these values when the user inputs data into the form
  // ...

  //send data to server
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    closeModal();

    const response = await fetch("http://localhost:3001/set-uinfo-firstlogin", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usertype: userType,
        student_number: studentNumber,
        org: org,
        course: course,
        college: college,
        department: department,
        email: email,
      }),
    });
  };
  console.log("ISFIRST LOGIN", isFirstLogin);

  const orgs = [
    "ADVENTIST MINISTRY TO COLLEGE AND UNIVERSITY STUDENTS UPLB CHAPTER (AMICUS-UPLB CHAPTER)",
    "ACTUARIAL SCIENCE SOCIETY (UPLB ACTSS)",
    "AGRIBUSINESS SOCIETY (UP ABS)",
    "Agricultural and Applied Economics Circle (UPAAEC)",
    "AGRICULTURAL SOCIETY (UP AGRISOC)",
    "Ahon Batang CALABARZON - UPLB (ABACA-UPLB)",
    "AIESEC (AIESEC in UPLB)",
    "Alleluia Community-Christ’s Youth in Action UPLB ( AC-CYA UPLB)",
    "ALLIANCE OF CHEMICAL ENGINEERING STUDENTS (UP AChES)",
    "ALLIANCE OF COMPUTER SCIENCE STUDENTS UPLB (ACSS UPLB)",
    "ALLIANCE OF DEVELOPMENT COMMUNICATION STUDENTS (UP ADS)",
    "ALLIANCE OF ECONOMICS AND MANAGEMENT STUDENTS (UPAEMS)",
    "Alliance of Gamers (UP AG)",
    "ALLIANCE OF STATISTICS MAJORS UPLB (ASM UPLB)",
    "ALLIANCE OF STUDENTS UNIFIED FOR SOCIOLOGY (UP ASUS)",
    "ALPHA CHIRON SOCIETY (UPACS)",
    "ALPHA SIGMA FRATERNITY (MASIG)",
    "ANA KALANG SOCIETY (UP AKS)",
    "ANAKBAYAN UP LOS BAÑOS (AB-UPLB)",
    "ANIMAL SCIENCE SOCIETY (UPASS)",
    "ASSOCIATION OF FILIPINO FORESTRY STUDENTS-UPLB (AFFS-UPLB, INC.)",
    "ASTRONOMICAL SOCIETY (UPLB ASTROSOC)",
    "BABAYLAN (BABAYLAN)",
    "BANAHAW (UP BANAHAW)",
    "BASKETBOLEROS, BASKETBOLERAS: ANG LIGANG LAMANG (UP BBALL)",
    "BETA KAPPA FRATERNITY (UP BK)",
    "BETA SIGMA FRATERNITY (UPLB BE)",
    "BROTHERHOOD OF NOBLE ENGINEERS (UP BNE)",
    "BUGKOS (BUGKOS)",
    "CABALLEROS (UPC)",
    "CAGAYANOS (UPC)",
    "CALAMBEÑOS (UP CALAMBEÑOS)",
    "CAMPUS CRUSADE FOR CHRIST (UPLB CCC)",
    "Career Assistance Program (UPLB CAP)",
    "CATANDUNGAN LOS BANOS (UPCATLB)",
    "CELL BIOLOGICAL SOCIETY (UP CELLS)",
    "Cheerdance Team (UPLBCDT)",
    "CHEMICAL KINETICS SOCIETY (UPLB CHEMO)",
    "CHEMICAL SOCIETY (UPLB CHEMSOC)",
    "CHI EPSILON SORORITY (UP CE)",
    "CHORAL ENSEMBLE (UPLB CE)",
    "CHRISTIANS ON CAMPUS-UPLB (COC-UPLB)",
    "CIRCLE K CLUB OF THE UNIVERSITY OF THE PHILIPPINES - LOS BANOS (CKI UPLB)",
    "CIVIL ENGINEERING EXECUTIVE ORGANIZATION (CEO)",
    "CIVIL ENGINEERING SOCIETY (UPCES)",
    "Club for UNESCO - UPLB (UNESCO CLUB UPLB)",
    "COM ARTS SOCIETY (COMARTSOC)",
    "COMMUNITY BROADCASTERS' SOCIETY (UP COMBROADSOC)",
    "Compassion for Animals Through Service of UPLB Students (CATS of UPLB)",
    "COMPUTER SCIENCE SOCIETY (UPLB COSS)",
    "CONCORDIA SCIENTIA ANIMALIS (UPCSA)",
    "DATA SCIENCE GUILD (UPLBDSG)",
    "DELTA LAMBDA SIGMA SORORITY (DLS)",
    "DEMOLAY CLUB (UPLB DEMOLAY CLUB)",
    "DEPARTMENT OF SCIENCE AND TECHNOLOGY SCHOLARS' SOCIETY (UPLB DOST SS)",
    "DEVELOPMENT COMMUNICATORS' SOCIETY (UPLB DCS)",
    "Development Management and Governance Society (UP DMGS)",
    "ECOLOGY AND SYSTEMATICS MAJOR STUDENTS SOCIETY (UP ECOSYSTEMSS)",
    "ECONOMICS SOCIETY (ECONSOC)",
    "ENGINEERING RADIO GUILD - LOS BANOS (UP ERG - LB)",
    "ENGINEERING SOCIETY (UPLB ENGSOC)",
    "ENGINEERING STUDENTS' GUILD (UPESG)",
    "ENTOMOLOGICAL SOCIETY (UP EntomSoc)",
    "ENVIRONMENTAL SCIENCE SOCIETY (UPLB ENVISOC)",
    "EPSILON CHI FRATERNITY, BETA CHAPTER (UP EX)",
    "EUYEOMUYEO JOJIK (EUYEO)",
    "EVERY NATION CAMPUS - UNIVERSITY OF THE PHILIPPINES LOS BANOS (EN CAMPUS UPLB)",
    "FILM CIRCLE (UPFC)",
    "FORESTRY SOCIETY (UPLB FS)",
    "Gabay Isko - University of the Philippines Los Baños (GABI - UPLB)",
    "Game On (UPLB GO)",
    "GAMMA SIGMA FRATERNITY UP RED SCORPIONS (UPGS)",
    "GAMMA SIGMA SORORITY UP RED SCORPIONS (GSS)",
    "GAWAD KALINGA - LOS BANOS (UPGK-LB)",
    "GENETIC RESEARCHERS AND AGRICULTURAL INNOVATORS SOCIETY (UP GRAINS)",
    "GENETICS SOCIETY (GENESOC)",
    "GRAND ORDER OF THE EAGLES (UP EAGLES)",
    "GRANGE ASSOCIATION (GRANGE)",
    "GRAPHIC LITERATURE GUILD (GLG)",
    "GUILD OF UNITED MINDS (UP PRAEFECTS)",
    "GURO: MATHEMATICS AND SCIENCE TEACHING SOCIETY (U.P. GURO)",
    "HARING IBON UPLB (HARING IBON)",
    "HARMONYA: THE STRING ENSEMBLE OF UPLB (HARMONYA)",
    "HIN-AY (HIN-AY)",
    "HORTICULTURAL SOCIETY (UP HortSoc)",
    "HUMAN AND FAMILY DEVELOPMENT SOCIETY (UP HFDSOC)",
    "HUMAN ECOLOGY STUDENT SOCIETY (UP HESS)",
    "INDUSTRIAL ENGINEERING STUDENTS' ORGANIZATION (UPLB IESO)",
    "International Veterinary Students' Association UP Los Baños (IVSA UPLB)",
    "ISABELA SOCIETY (UPIS)",
    "JAMMERS' CLUB (UPJC)",
    "JOCKS (THE UPLB JOCKS)",
    "JUNIOR EXECUTIVE SOCIETY (UPJES)",
    "KABATAANG ALYANSA NG MAY DUGONG TAGA- HILAGANG KAMARINES (UP KAADHIKA)",
    "KAIBAN (KAIBAN)",
    "KAPATIRANG PITONG LAWA SA UPLB (KAPWA SA UPLB)",
    "KAPATIRANG PLEBEIANS-UPLB CURIA (Plebes UPLB)",
    "KAPPA EPSILON FRATERNITY, UPLB CHAPTER (UP KE)",
    "KAPPA PHI SIGMA - CONSERVATION AND DEVELOPMENT SOCIETY (UP KPS-CDS)",
    "KARTUNISTA-MANUNULAT KOLEKTIB (KK)",
    "LADY VETERINARY STUDENTS' ASSOCIATION (UPLVSA)",
    "LAKAS-ANGKAN YOUTH FELLOWSHIP (UPLB-LAYF)",
    "LAWN TENNIS RACQUETEERS' LEAGUE (UP LATERAL)",
    "LEAGUE OF AGRICULTURAL BIOTECHNOLOGY STUDENTS (UP LABS)",
    "LEAGUE OF AGRICULTURAL CHEMISTRY STUDENTS (UP LACS)",
    "LEAGUE OF AGRICULTURAL ENGINEERING STUDENTS (N.G.)",
    "League of Filipino Students - UPLB (LFS-UPLB)",
    "Linking Everyone Towards Service in the College of Development Communication (LETS-CDC)",
    "LISIEUX MUSIC MINISTRY (UPLB LMM)",
    "LUMABAY - LABAY CLUB '57 (LABAY 57)",
    "MAKILING CAMPUS RUNNERS (MACRUNNERS)",
    "MAKILING ULTIMATE CLUB (MUC)",
    "MASBATENOS (MASBA)",
    "MATHEMATICAL SCIENCES SOCIETY (UPLB MASS)",
    "MI-ABEYABE (MIYABE)",
    "MICROBIOLOGICAL SOCIETY (UPLB MICROSOC)",
    "MINDORENOS (UP MINDORENOS)",
    "Missionary Families of Christ CAMPUS - UPLB (MFC CAMPUS - UPLB)",
    "MOUNTAINEERS (UPLB MOUNTAINEERS)",
    "MUNSCI ALUMNI SOCIETY (UP MUNSCIALS)",
    "MUSSAENDA HONOR SORORITY (UP MHS)",
    "NEXUS FILIAE SORORITY (NEXUS FILIAE)",
    "NOVO ECIJANOS (UPNE)",
    "OFFICE OF STUDENT ACTIVITIES (UPLB OSA)",
    "OIKOS (OIKOS)",
    "OROQUIETA (UPO)",
    "PABULUM SCIENTIA SODALITAS (UP PSS)",
    "PAINTERS' CLUB (UPPC)",
    "PALARIS CONFRATERNITY (UPPC)",
    "PARLIAMENT: UPLB DEBATE SOCIETY (UPLB DEBSOC)",
    "PENINSULARES (UPP)",
    "PENINSULARES (UP PENINSULARES)",
    "PHILIPPINE ASSOCIATION OF FOOD TECHNOLOGISTS, INC. - BETA CHAPTER (PAFT BETA)",
    "PHILIPPINE ASSOCIATION OF NUTRITION-ALPHA OMEGA CHAPTER (PAN-AO)",
    "PHILOBIOSCIENTIA, THE UPLB LIFE SCIENCES SOCIETY (PHILEOS)",
    "PHILOSOPHICAL SOCIETY OF UPLB (PHILOSOC)",
    "PHOTOGRAPHERS' SOCIETY (UP PHOTOS)",
    "PHYSIKA, UP APPLIED PHYSICS SOCIETY (PHYSIKA)",
    "PHYTOPATHOLOGICAL SOCIETY (UPPS)",
    "Pickleball Club (UPLB PC)",
    "RANCHERS' CLUB PHILIPPINES (RANCHERS)",
    "RED CROSS YOUTH OF UNIVERSITY OF THE PHILIPPINES LOS BANOS (RCY OF UPLB)",
    "RHETORICIANS - UPLB SPEECH COMMUNICATION ORGANIZATION (Rheto)",
    "RIZALENOS (RIZALEÑOS)",
    "RODEO CLUB PHILIPPINES (UP RC)",
    "SAMAHANG BUSKO - UPLB (UP BUSKO)",
    "SAMAHANG EKOLOHIYA NG UPLB (SAMAEKO-UPLB)",
    "Samahan ng mga Lantay na Diamante (UP SALADIA)",
    "SAMAHAN NG MGA MAG-AARAL NG TEKNOLOHIYANG PANLIPUNAN-UPLB (STP-UPLB)",
    "SANDAYAW CULTURAL GROUP (SANDAYAW)",
    "SANDIWA SAMAHANG BULAKENYO (UPSSB)",
    "SANTA ROSA SCIENCE AND TECHNOLOGY ALUMNI ORGANIZATION (UP STRATOS)",
    "SARONG BANGGI (UPSB)",
    "SENTAI ONGAKU MANGA ANIME SOSHIKI (UP SOMA SOSHIKI)",
    "SIGMA ALPHA NU SORORITY (EAN)",
    "SIGMA ALPHA SORORITY (UP SIGMA ALPHA)",
    "SIGMA BETA SORORITY LOS BANOS CHAPTER (UP EB)",
    "SIGMA DELTA PHI (SDP)",
    "SIGMA RHO FRATERNITY (SIGMA RHO)",
    "SILAKBO (SLKB)",
    "SOCIETAS MULIERUM (UPSMSORO)",
    "SOCIETY FOR THE ADVANCEMENT OF VETERINARY EDUCATION AND RESEARCH (UP SAVER)",
    "SOCIETY OF AGRICULTURAL AND RURAL DEVELOPMENT SCHOLARS (UPLB ARDSS)",
    "SOCIETY OF AGRICULTURAL ENGINEERING STUDENTS (UP SAGES)",
    "SOCIETY OF AGRONOMY MAJOR STUDENTS (UPHILSAMS)",
    "SOCIETY OF APPLIED MATHEMATICS OF UPLB (SAM-UP)",
    "SOCIETY OF CHEMICAL ENGINEERING STUDENTS (UPLB SChemES)",
    "SOCIETY OF ELECTRICAL ENGINEERING STUDENTS (UPLB SELES)",
    "SOCIETY OF EXCHANGE STUDENTS UP (SExS-UP)",
    "SOCIETY OF HUMAN SETTLEMENTS PLANNERS (UP HSP Soc)",
    "SOCIETY OF MANAGEMENT AND ECONOMICS STUDENTS (UP SMES)",
    "SOCIETY OF MATH MAJORS (SMM)",
    "SOCIETY OF PRE-MED STUDENTS (SPS)",
    "SOCIOLOGY SOCIETY (SOCIOSOC)",
    "SOCIUS (UP SOCIUS)",
    "SOIL SCIENCE SOCIETY (UPSSS)",
    "Sophia Circle (Sophia Circle)",
    "STATE VARSITY CHRISTIAN FELLOWSHIP (SVCF-UPLB)",
    "STATISTICAL SOCIETY (UPLB STATS)",
    "Student Catholic Action - Los Baños (UPSCA-LB)",
    "STUDENTS OF DESTINY (UP SOD)",
    "SYMBIOSIS, THE UPLB BIOLOGICAL SOCIETY (SYMBIOSIS)",
    "TARABIDAN 'Y ANG MGA PALAWEÑO (UP TARABIDAN)",
    "TAU ALPHA FRATERNITY (TAU ALPHA)",
    "Tau Lambda Alpha (TLA)",
    "The Gavel Club of UPLB (GC UPLB)",
    "THETA EPSILON SORORITY (UP THE)",
    "The UP Landscape Agroforestry, Agricultural Systems and Extension Society (The UP LAES/UP LAES)",
    "The UPLB Pre-Law Society (UPLB PLS)",
    "Triskelion (UPLB Triskelions)",
    "Umalohokan, Inc. (Umal)",
    "University of the Philippines Los Banos Mechanical Engineering Guild (UPLB MEG)",
    "UPSILON SIGMA PHI (UPSILON)",
    "VARRONS LTD. (UPVL)",
    "VENERABLE KNIGHT VETERINARIANS FRATERNITY (VKV FRATERNITY)",
    "VENERABLE LADY VETERINARIANS SORORITY (UP VLV Sorority)",
    "VETERINARY MEDICAL STUDENTS' SOCIETY (UP VETSOC)",
    "VOLLEYBALL CLUB (UPLB VC)",
    "WYRE UNDERGROUND OF UPLB (WYRE)",
    "YOUNG ENTREPRENEURS' SOCIETY UP (YES UP)",
    "YOUNG SOFTWARE ENGINEERS' SOCIETY (YSES)",
    "YOUTH FOR CHRIST UPLB (YFC-UPLB)",
    "ZETA BETA RHO HONOR FRATERNITY (UP ZBRHF)",
    "ZOOLOGICAL SOCIETY (OZOOMS)",
    "Others",
  ]; // Replace with orgs
  const courses = [
    "BS Agricultural Biotechnology",
    "BS Agricultural Chemistry",
    "BS Agriculture",
    "BS Food Science and Technology",
    "Master in Animal Nutrition",
    "Master in Food Engineering",
    "Master of Agriculture major in Agronomy",
    "Master of Agriculture major in Horticulture",
    "Master of Science in Agricultural Chemistry",
    "Master of Science in Agricultural Education",
    "Master of Science in Agronomy",
    "Master of Science in Animal Science",
    "Master of Science in Botany",
    "Master of Science in Food Science",
    "Master of Science in Holticulture",
    "Master of Science in Plant Breeding",
    "Master of Science in Plant Genetics Resources Conservation and Management",
    "Master of Science in Plant Pathology",
    "Master of Science in Rural Sociology",
    "Master of Science in Soil Science",
    "PhD by Research in Food Science",
    "BA Communication Arts",
    "BA Philosophy",
    "BA Sociology",
    "BS Applied Mathematics",
    "BS Applied Physics",
    "BS Biology",
    "BS Chemistry",
    "BS Computer Science",
    "BS Mathematics",
    "BS Mathematics and Science Teaching",
    "BS Statistics",
    "Master in Communication Arts",
    "Master in Science in Physics",
    "Master of Arts in Communication Arts",
    "Master of Arts in Sociology",
    "Master of Information Technology",
    "Master of Science in Biochemistry",
    "Master of Science in Chemistry",
    "Master of Science in Computer Science",
    "Master of Science in Genetics",
    "Master of Science in Mathematics",
    "Master of Science in Microbiology",
    "Master of Science in Molecular Biology and Biotechnology",
    "Master of Science in Statistics",
    "Master of Science in Wildlife Studies",
    "Master of Science in Zoology",
    "PhD by Research in Agricultural Chemistry",
    "PhD by Research in Biochemistry",
    "PhD by Research in Wildlife Science",
    "PhD by Research in Zoology",
    "Associate of Science in Development Communication",
    "BS Development Communication",
    "Master of Science in Development Communication",
    "Associate in Arts in Entrepreneurship",
    "Bachelor of Science in Accountancy",
    "BS Agribusiness Management and Entrepreneurship",
    "BS Agricultural and Applied Economics",
    "BS Economics",
    "Master of Management major in Agribusiness Management and Entrepreneurship",
    "Master of Management major in Business Management",
    "Master of Management major in Cooperative Management",
    "Master of Science in Agricultural Economics",
    "Master of Science in Economics",
    "Bachelor of Science in Materials Engineering",
    "Bachelor of Science in Mechanical Engineering",
    "BS Agricultural and Biosystems Engineering",
    "BS Chemical Engineering",
    "BS Civil Engineering",
    "BS Electrical Engineering",
    "BS Industrial Engineering",
    "BS Materials Engineering",
    "BS Mechanical Engineering",
    "Master in Food Engineering",
    "Master of Science in Agricultural Engineering",
    "Master of Science in Agrometeorology",
    "Master of Science in Chemical Engineering",
    "PhD by Research in Chemical Engineering",
    "Associate of Science in Forestry",
    "BS Forestry",
    "Master of Forestry",
    "Master of Science in Forestry",
    "Master of Science in Natural Resources Conservation",
    "BS Human Ecology",
    "BS Nutrition",
    "Graduate Diploma in Environmental Planning",
    "Master in Clinical Nutrition",
    "Master of Professional Studies in Food and Nutrition Planning",
    "Master of Science in Applied Nutrition",
    "Master of Science in Clinical Nutrition",
    "Master of Science in Family Resource Management",
    "PhD by Research in Human Development",
    "Doctor of Veterinary Medicine",
    "Master in Veterinary Epidemiology",
    "Master of Science in Veterinary Medicine",
    "PhD by Research in Veterinary Medicine",
    "PhD in Veterinary Medicine (Residential Mode)",
    "Master in Public Affairs",
    "Master of Development Management and Governance",
    "Master of Science in Community Development",
    "Master of Science in Development Management and Governance",
    "Master of Science in Extension Education",
    "Master of Science in Environmental Science",
    "PhD in Environmental Diplomacy and Negotiations",
    "Professional Masters in Tropical Marine Ecosystems Management",
  ]; // Replace with  courses
  const colleges = [
    "College of Agriculture and Food Science (CAFS)",
    "College of Arts and Sciences (CAS)",
    "College of Development Communication (CDC)",
    "College of Economics and Management (CEM)",
    "College of Engineering and Agro-industrial Technology (CEAT)",
    "College of Forestry and Natural Resources (CAFS)",
    "College of Human Ecology (CEM)",
    "College of Veterinary Medicine (CVM)",
    "College of Public Affairs and Development (CPAf)",
    "Graduate School",
    "School of Environmental Science and Management (SESAM)",
  ]; // Replace with your courses
  const departments = [
    "Agricultural Systems Institute (ASI)",
    "Institute of Animal Science (IAS)",
    "Institute of Crop Science (ICropS)",
    "Institute of Food Science and Technology (IFST)",
    "Institute of Weed Science, Entomology and Plant Pathology (IWEP)",
    "Institute of Biological Sciences (IBS)",
    "Institute of Chemistry (IC)",
    "Institute of Computer Science (ICS)",
    "Institute of Mathematical Sciences and Physics (IMSP)",
    "Institute of Statistics (INSTAT)",
    "Department of Humanities (DHUM)",
    "Department of Social Sciences (DSS)",
    "Department of Human Kinetics (DHK)",
    "UP Rural High School (UPRHS)",
    "Department of Development Broadcasting and Telecommunication",
    "Department of Development Journalism",
    "Department of Educational Communication",
    "Department of Science Communication",
    "Department of Agribusiness Management & Entrepreneurship",
    "Department of Agricultural and Applied Economics",
    "Department of Economics",
    "Institute of Cooperatives and Bio-Enterprise Development",
    "Institute of Agricultural and Biosystems Engineering",
    "Department of Chemical Engineering",
    "Department of Civil Engineering",
    "Department of Electrical Engineering",
    "Department of Industrial Engineering",
    "Department of Mechanical Engineering",
    "Department of Engineering Science",
    "Forest Biological Sciences",
    "Forest Products and Paper Science",
    "Social Forestry and Forest Governance",
    "Institute of Renewable Natural Resources",
    "Department of Community and Environmental Resource Planning (DCERP)",
    "Department of Human and Family Development Studies (DHFDS)",
    "Department of Social Development Services (DSDS)",
    "Institute of Human Nutrition and Food (IHNF)",
    "Department of Basic Veterinary Sciences",
    "Department of Veterinary Paraclinical Sciences",
    "Department of Veterinary Clinical Sciences",
    "Institute for Governance and Rural Development (IGRD)",
    "Community Innovations Studies Center (CISC)",
    "Center for Strategic Planning and Policy Studies (CSPPS)",
  ]; // Replace with your courses

  return (
    <div>
      {/* <Button onClick={() => setIsOpen(true)}>Open modal</Button> */}
      <Modal
        open={isOpen}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          bgcolor="background.paper"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%", // Set the width to 80% of the viewport width
            height: "50%",
            padding: 5,
            borderRadius: 10,
          }}
          //   alignContent="center"
        >
          <Typography
            id="modal-modal-title"
            color="primary"
            variant="h4"
            component="h2"
            fontWeight="bold"
          >
            Welcome to ICSpaces, {""}
            <Typography
              color="secondary"
              component="span"
              variant="h4"
              fontWeight="bold"
            >
              {firstName}
            </Typography>
            !
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, pt: 2 }}>
            Please fill out the following information to complete your profile:
          </Typography>
          <form onSubmit={handleSubmit}>
            {userType === 0 && (
              <Box
                sx={{
                  display: "flex", // Use Flexbox for layout
                  flexDirection: "column", // Stack the children vertically
                  gap: 2, // Add a gap between the children
                  flexWrap: "wrap", // Allow the children to wrap onto multiple lines
                  height: "150px",
                  paddingTop: "20px",
                }}
              >
                <TextField
                  required
                  id="student_number"
                  label="Student Number"
                  placeholder="xxxx-xxxxx"
                  sx={{ width: "50%" }}
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  inputProps={{
                    pattern: "\\d{4}-\\d{5}",
                    title: "Student number must be in the format: xxxx-xxxxx",
                  }}
                />
                <Autocomplete
                  id="organizations"
                  options={orgs}
                  value={org}
                  onChange={(event, newValue) => {
                    setOrg(newValue);
                  }}
                  sx={{ width: "50%" }}
                  renderInput={(params) => (
                    <TextField {...params} required label="Organization" />
                  )}
                />

                <Autocomplete
                  id="courses"
                  options={courses}
                  value={course}
                  onChange={(event, newValue) => {
                    setCourse(newValue);
                  }}
                  sx={{ width: "50%" }}
                  renderInput={(params) => (
                    <TextField {...params} required label="Course" />
                  )}
                />

                <Autocomplete
                  id="college"
                  options={colleges}
                  value={college}
                  onChange={(event, newValue) => {
                    setCollege(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} required label="College" />
                  )}
                />
              </Box>
            )}
            {userType === 1 && (
              <>
                <Autocomplete
                  id="college"
                  options={colleges}
                  value={college}
                  onChange={(event, newValue) => {
                    setCollege(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} required label="College" />
                  )}
                />

                <Autocomplete
                  id="department"
                  options={departments}
                  value={department}
                  onChange={(event, newValue) => {
                    setDepartment(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} required label="Department" />
                  )}
                />
              </>
            )}

            <Button
              variant="contained"
              type="submit"
              // onClick={closeModal}
              fullWidth
              sx={{ mt: "10px" }}
            >
              Submit
            </Button>
          </form>
          {/* <Button onClick={closeModal}>Close</Button> */}
        </Box>
      </Modal>
    </div>
  );
};

export default FirstLogInPopUp;
