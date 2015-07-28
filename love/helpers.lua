--
-- Static helper functions
--

--- Is data in table?
-- @param [any] data Data to search for.
-- @param [{any}] table Table to search in.
-- @return [boolean] Is that data in the table? 
function Helper_inTable(data, table)
	-- Adapted from: http://stackoverflow.com/questions/656199/search-for-an-item-in-a-lua-list
 	local valid = {}
 	for i = 1, #table do
  		valid[table[i]] = true
 	end
 	if valid[data] then
  		return true
 	else
  		return false
 	end
end

--- Bubble sort a table in either decending (true) or ascending order (false)
-- @param [{any}] table Table to sort.
-- @param [boolean] descending Sort in descending order?
function Helper_bubbleSort(table, descending)
  -- Adapted from: http://rosettacode.org/wiki/Sorting_algorithms/Bubble_sort#Lua
  local itemCount = #table
  local hasChanged
  repeat
    hasChanged = false
    itemCount= itemCount - 1
    if descending then
	    for i = 1, itemCount do
	      if table[i] < table[i + 1] then
	        table[i], table[i + 1] = table[i + 1], table[i]
	        hasChanged = true
	      end
	    end
	else
		for i = 1, itemCount do
	      if table[i] > table[i + 1] then
	        table[i], table[i + 1] = table[i + 1], table[i]
	        hasChanged = true
	      end
	    end
	end
  until hasChanged == false
end
