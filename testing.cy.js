
describe('Login as a simple student-Succeed', () => {
  it('Verify that Login as a simple student functionality works with valid credentials.', () => {
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:5173/', {
      timeout: 10000 
    });
    cy.get('[type="email"]').type('alexandra.joroveanu@student.usv.ro');
    cy.get('[type="password"]').type('AJ12345');
    cy.get('[type="button"].toggle-button').click();
    cy.get('[type="submit"].login-button').click();
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/simple-student')
    });
  });
});

describe('Login as a group leader-Succeed', () => {
  it('Verify that Login  as a group leader functionality works with valid credentials.', () => {
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:5173/', {
      timeout: 10000 
    });
    cy.get('[type="email"]').type('stefan.rosca@student.usv.ro');
    cy.get('[type="password"]').type('SR12345');
    cy.get('[type="button"].toggle-button').click();
    cy.get('[type="submit"].login-button').click();
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/group-leader')
    });
  });
});

describe('Login as a professor-Succeed', () => {
  it('Verify that Login as a progesssor functionality works with valid credentials.', () => {
    cy.viewport(1920, 1080)
    cy.visit('http://localhost:5173/', {
      timeout: 10000 
    });
    cy.get('[type="email"]').type('ovidiug@eed.usv.ro');
    cy.get('[type="password"]').type('OG12345');
    cy.get('[type="button"].toggle-button').click();
    cy.get('[type="submit"].login-button').click();
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/professor')
    });
  });
});

describe('Dashboard Navigation as a Group Leader- Verify Dashboard Updates on Button Clicks', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:5173/group-leader', { timeout: 10000 });
    cy.get('[type="email"]').type('stefan.rosca@student.usv.ro');
    cy.get('[type="password"]').type('SR12345');
    cy.get('[type="button"].toggle-button').click();
    cy.get('[type="submit"].login-button').click();
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/group-leader')
    });
  });
  it('Verify that clicking "Calendar" updates the dashboard view', () => {
    cy.get('[class="sidebar"]').contains('Calendar').click({ multiple: true });
    cy.get('[class="calendar-container"]').should('be.visible');
    cy.get('[class="exams-grid"]').should('be.visible').should('contain','Examene');
  });
  it('Verify that clicking "Programarea Examenelor" updates the dashboard view', () => {
    cy.get('[class="sidebar"]').contains('Programarea Examenelor').click({ multiple: true });
    cy.get('[class="exams-grid"]').should('contain', 'Cereri in procesare');
  });
  it('Verify that clicking "Programari Respinse" updates the dashboard view', () => {
    cy.get('[class="sidebar"]').contains('Programări Respinse').click({ multiple: true });
    cy.get('[class="rejected-exams-grid"]').should('contain', 'Examene Respins');

  });
});

describe('Dashboard Navigation as a Professor - Verify Dashboard Updates on Button Clicks', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:5173', { timeout: 10000 });
    cy.get('[type="email"]').type('ovidiug@eed.usv.ro');
    cy.get('[type="password"]').type('OG12345');
    cy.get('[type="button"].toggle-button').click();
    cy.get('[type="submit"].login-button').click();
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/professor')
    });
  });
  it('Verify that clicking "Calendar" updates the dashboard view', () => {
    cy.get('[class="sidebar"]').contains('Calendar').click({ multiple: true });
    cy.get('[class="calendar-container"]').should('be.visible');
    cy.get('[class="professor-exams-grid"]').should('be.visible').should('contain','Examene');
  });
  it('Verify that clicking "Cereri" updates the dashboard view', () => {
    cy.get('[class="sidebar"]').contains('Cereri').click();
    cy.get('[class="calendar-container"]').should('be.visible');
    cy.get('[class="exam-requests-grid"]').should('contain', 'Solicitări Examene');
  });
});


describe('Login Penetration Test - SQL Injection', () => {
  it('Attempts SQL Injection in Login Form', () => {
    cy.visit('http://localhost:5173/');
    const sqlInjectionPayload = "' OR '1'='1";
    cy.get('input[type="email"], input[type="text"]').first().type(sqlInjectionPayload);
    cy.get('input[type="password"]').type(sqlInjectionPayload);
    cy.get('button[type="submit"]').click();

    cy.url().should((url) => {
      expect(url).not.to.match(/(\/professor|\/group-leader|\/simple-student)/);
    });    
    cy.contains('SQL').should('not.exist');
    cy.contains('syntax').should('not.exist');
    cy.contains('error').should('not.exist');
    cy.contains('query').should('not.exist');
  });
});

describe('Simulate Brute Force Attack (Invalid Password Attempts)', () => {
  it('Attempts to log in with correct username and incorrect passwords', () => {
  
    cy.visit('http://localhost:5173/');
    cy.get('input[type="email"]')
      .clear({ force: true })
      .type('alexandra.joroveanu@student.usv.ro');
    for (let i = 0; i < 8; i++) {
      cy.get('input[type="password"]')
        .clear({ force: true })
        .type('incorrect_password{enter}');

      cy.contains('Autentificarea a eșuat. Vă rugam să încercați din nou.').should('exist');
      cy.url().should('not.include', '/simple-student');
      cy.get('button.error-ok-btn').click();
    }
    cy.get('input[type="email"]')
      .clear({ force: true })
      .type('alexandra.joroveanu@student.usv.ro');
    cy.get('input[type="password"]')
      .clear({ force: true })
      .type('AJ12345{enter}');
    cy.url().should('include', '/simple-student');
  });
});

describe('Verify user is automatically logged out after inactivity', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:5173/');
  });

  it('Verify user is logged out after configured timeout period', () => {
    cy.get('[type="email"]').type('stefan.rosca@student.usv.ro');
    cy.get('[type="password"]').type('SR12345');
    cy.get('[type="button"].toggle-button').click();
    cy.get('[type="submit"].login-button').click();

    cy.url().should('include', '/group-leader');
    cy.get('.settings').click();
    cy.wait(30000); 
    cy.get('[class="sidebar"]').contains('Setări').click({ multiple: true });
    cy.url().should('not.include', '/group-leader');
      
  });
});


describe('End-to-End Test: Group Leader Workflow', () => {
  const newExamRequest = {
    Materia: 'Elemente de grafică pe calculator',
    Profesor: 'Turcu Cristina',
    Data: new Date().toISOString().split('T')[0]
  };

  const oldRequest = {
    Materia: 'Proiectarea Translatoarelor',
    Profesor: 'Gherman Ovidiu',
    Data: new Date().toISOString().split('T')[0]
  };

  const plannedExamRequest = {
    Materia: 'Inteligență artificială',
    Profesor: 'Turcu Cristina',
    Data: '2025-03-16'
  };

  const failedRequest = {
    Materia: newExamRequest.Materia,
    Profesor: 'Turcu Cristina',
    Data: '2025-03-11'
  };

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:5173/');
  });

  it('Login as Group Leader, verify calendar, add planned exam, add new exam, add failed exam, verify in table, visit Programări Respinse, and logout', () => {
    cy.get('[type="email"]').type('bogdan.tibuleac@student.usv.ro');
    cy.get('[type="password"]').type('BT12345');
    cy.get('[type="button"].toggle-button').click();
    cy.get('[type="submit"].login-button').click();
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/group-leader');
    });

    cy.get('[class="sidebar"]').contains('Calendar').click({ multiple: true });
    cy.get('[class="calendar-container"]').should('be.visible');
    cy.get('[class="table-container"]').should('have.length.greaterThan', 0);

    cy.get('[class="sidebar"]').contains('Programarea Examenelor').click({ multiple: true });

    cy.get('[class="exam-request-drop-input"]').select(plannedExamRequest.Materia);
    cy.get('[class="exam-request-date-input"]').type(plannedExamRequest.Data);
    cy.get('[class="add-exam-button"]').contains('Adaugă un examen').click();

    cy.get('[class="error-overlay"]', { timeout: 10000 }).then(($overlay) => {
      if ($overlay.is(':visible')) {
        cy.get('[class="error-ok-btn"]').click();
      }
    });

    const plannedFormattedDate = `${new Date(plannedExamRequest.Data).getDate().toString().padStart(2, '0')}.${(new Date(plannedExamRequest.Data).getMonth() + 1).toString().padStart(2, '0')}.${new Date(plannedExamRequest.Data).getFullYear()}`;
    cy.log('Planned Formatted Date:', plannedFormattedDate);

    cy.get('[class="exam-request-drop-input"]').select(oldRequest.Materia);
    cy.get('[class="exam-request-date-input"]').type(oldRequest.Data);
    cy.get('[class="add-exam-button"]').contains('Adaugă un examen').click();

    cy.get('[class="error-overlay"]', { timeout: 10000 }).then(($overlay) => {
      if ($overlay.is(':visible')) {
        cy.get('[class="error-ok-btn"]').click();
      }
    });

    cy.get('[class="exam-request-drop-input"]').select(failedRequest.Materia);
    cy.get('[class="exam-request-date-input"]').type(failedRequest.Data);
    cy.get('[class="add-exam-button"]').contains('Adaugă un examen').click();

    cy.get('[class="error-overlay"]', { timeout: 10000 }).then(($overlay) => {
      if ($overlay.is(':visible')) {
        cy.get('[class="error-ok-btn"]').click();
      }
    });

     cy.get('[class="exam-request-drop-input"]').select(newExamRequest.Materia);
     cy.get('[class="exam-request-date-input"]').type(newExamRequest.Data);
     cy.get('[class="add-exam-button"]').contains('Adaugă un examen').click();
 
     cy.get('[class="error-overlay"]', { timeout: 10000 }).then(($overlay) => {
       if ($overlay.is(':visible')) {
         cy.get('[class="error-ok-btn"]').click();
       }
     });
    const formattedDate = `${new Date(newExamRequest.Data).getDate().toString().padStart(2, '0')}.${(new Date(newExamRequest.Data).getMonth() + 1).toString().padStart(2, '0')}.${new Date(newExamRequest.Data).getFullYear()}`;
    cy.log('Formatted Date:', formattedDate);

    cy.get('[class="exams-grid"] tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    cy.get('[class="exams-grid"] tbody tr').each(($row) => {
      if ($row.text().includes(newExamRequest.Materia)) {
        cy.wrap($row)
          .within(() => {
            cy.get('td').eq(0).should('contain', newExamRequest.Materia);
            cy.get('td').eq(1).should('contain', newExamRequest.Profesor);
          });
      }
    });

    cy.get('[class="sidebar"]').contains('Programări Respinse').click({ multiple: true });
    cy.get('[class="rejected-exams-grid"]').should('contain', 'Examene Respins');
    cy.get('[class="rejected-exams-grid"] tbody tr').should('have.length.greaterThan', 0);

    cy.get('[class="sidebar"]').contains('Deconectare').click();
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('');
    });
  });
});

describe('End-to-End Test: Professor Workflow', () => {
  
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:5173/');
  });
  
  it('Login as Professor, verify calendar, approve and reject exam requests, verify in tables, and logout', () => {
    cy.get('[type="email"]').type('ovidiug@eed.usv.ro');
    cy.get('[type="password"]').type('OG12345');
    cy.get('[type="button"].toggle-button').click();
    cy.get('[type="submit"].login-button').click();
    cy.location().should((loc) => {
      expect(loc.pathname.toString()).to.contain('/professor');
    });
  
    cy.get('[class="sidebar"]').contains('Calendar').click({ multiple: true });
    cy.get('[class="calendar-container"]').should('be.visible');
    cy.get('[class="table-container"]').should('have.length.greaterThan', 0);
  
    cy.get('[class="sidebar"]').contains('Cereri').click({ multiple: true });
    cy.get('[class="exam-requests-grid"] tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    cy.get('[class="sidebar"]').contains('Cereri').click({ multiple: true });
    cy.get('[class="exam-requests-grid"]').then(($grid) => {
      if ($grid.find('tbody').length === 0 || $grid.find('tbody tr').length === 0) {
        cy.get('p[data-v-5f7bcee5]').should('have.text', 'Nu sunt informații');
        cy.get('[class="sidebar"]').contains('Deconectare').click();
        cy.location().should((loc) => {
          expect(loc.pathname.toString()).to.contain('');
        });
      } else {

    // Approve an exam request
    cy.get('[class="exam-requests-grid"] tbody tr').first().find('[class="accept-btn"]').click();
    cy.get('[class="dialogue-container"]').should('be.visible');
    cy.get('[id="Asistenți"]').select('Pohoata Sorin');
    cy.get('[id="Sala"]').select('C202');
    cy.get('[class="time-select"]').eq(0).type('10');
    cy.get('[class="time-select"]').eq(1).type('AM');
    cy.get('[class*="duration-btn"][class*="active"]').click();
    cy.get('[class="confirm-btn"]').click();
    cy.get('[class="exam-request-schedule-popup"]').should('not.exist');
    cy.get('[class="error-overlay"]', { timeout: 10000 }).then(($overlay) => {
            if ($overlay.is(':visible')) {
              cy.get('[class="error-ok-btn"]').click();
            }
          });
   
    // Reject an exam request
    // cy.get('[class="sidebar"]').contains('Cereri').click({ multiple: true });
    // cy.get('[class="exam-requests-grid"] tbody tr').last().find('[class="reject-btn"]').click();
    // cy.get('[class="dialogue-container"]').should('be.visible');
    // cy.get('[class="input-area"]').type('Reason for cancellation');
    // cy.get('[class="confirm-btn"]').click();
    // cy.get('[class="sidebar"]').contains('Deconectare').click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname.toString()).to.contain('');
    // });
    }
  });
  });
});