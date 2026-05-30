// Test script to verify environment variables
console.log('=== Environment Variables Test ===\n')

console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0)
console.log('SERVICE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0)

const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (anonKey) {
  const parts = anonKey.split('.')
  console.log('\nANON_KEY parts:', parts.length)
  console.log('Part 1 length:', parts[0]?.length)
  console.log('Part 2 length:', parts[1]?.length)  
  console.log('Part 3 length:', parts[2]?.length)
  
  if (parts.length !== 3) {
    console.log('\n❌ ERROR: Key should have 3 parts separated by dots!')
    console.log('Current parts:', parts.length)
  } else if (parts[2]?.length < 20) {
    console.log('\n⚠️ WARNING: Third part (signature) seems too short!')
  } else {
    console.log('\n✅ Key format looks correct!')
  }
}
