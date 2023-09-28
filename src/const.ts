export const AJAX_INTERCEPTOR_PROJECTS = 'mock_genius_projects';
export const AJAX_INTERCEPTOR_CURRENT_PROJECT = 'mockgenius_current_project';
export const AJAX_KEYS = [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT]
export const CUSTOM_EVENT_NAME = 'CUSTOMEVENT'
export const INJECT_ELEMENT_ID = 'mock-genius'
export const  SCRIPT_JS = 'script[src*="insert.js"]'
export const defaultProjectProduct = {
  pathUrl: 'http://localhost:5173',
  rules: [{
    name: 'test',
    code: '200',
    switchOn: true,
    delay: '0',
    method: 'POST',
    pathRule: '/api/test',
    Response: {
      code: 200,
      data: {},
      message: 'success'
    },
  }],
  projectName: 'Default Project',
  isRealRequest: false,
  isTerminalLogOpen: false,
  switchOn: true
}

