export const apps = [{
	name: 'core',
	script: './src/index.js',
    exec_mode: 'cluster',
    instances: 'max', // gunakan semua core CPU	
	watch: ['./src', '.env'], // yang akan dipantau
	ignore_watch: ['node_modules', 'public'], // Direktori yang diabaikan
	watch_delay: 500, // Delay sebelum restart (ms)
}];