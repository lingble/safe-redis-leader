local key = KEYS[1]
local id = ARGV[1]
local ms = ARGV[2]

local current_id = redis.call('GET', key)
if (id == current_id) then
  redis.call('PEXPIRE', key, ms)
  return true
else
  return false
end