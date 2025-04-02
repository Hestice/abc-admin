const fs = require('fs');
const path = require('path');

// Ensure nx.json exists
if (!fs.existsSync('nx.json')) {
  const basicNxConfig = {
    extends: 'nx/presets/npm.json',
    affected: {
      defaultBase: 'main'
    },
    tasksRunnerOptions: {
      default: {
        runner: 'nx/tasks-runners/default',
        options: {
          cacheableOperations: ['build', 'test']
        }
      }
    }
  };
  fs.writeFileSync('nx.json', JSON.stringify(basicNxConfig, null, 2));
}

console.log('NX configuration patched successfully'); 