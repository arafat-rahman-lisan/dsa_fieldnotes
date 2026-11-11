/* Lesson notes, examples, and walkthrough frames. */
window.FIELDNOTES = {
  "topics": [
    {
      "title": "Arrays and linear scans",
      "slug": "running-sum-of-1d-array",
      "number": 1480,
      "problem": "Running Sum of 1d Array",
      "difficulty": "Easy",
      "category": "Foundation",
      "examples": [
        [
          "running_totals([4, -2, 3])",
          "[4, 2, 5]"
        ],
        [
          "running_totals([])",
          "[]"
        ]
      ],
      "frames": [
        [
          "Start with a total of 0.",
          [
            [
              "Input",
              "4 -2 3"
            ],
            [
              "Totals",
              "· · ·"
            ],
            [
              "Total",
              "0"
            ]
          ]
        ],
        [
          "Read index 0. Add 4 to the running total.",
          [
            [
              "Input",
              "*4 -2 3"
            ],
            [
              "Totals",
              "+4 · ·"
            ],
            [
              "Total",
              "4"
            ]
          ]
        ],
        [
          "Read index 1. Adding −2 reduces the running total to 2.",
          [
            [
              "Input",
              "4 *-2 3"
            ],
            [
              "Totals",
              "+4 +2 ·"
            ],
            [
              "Total",
              "2"
            ]
          ]
        ],
        [
          "Read index 2. Add 3 and write 5 as the final prefix.",
          [
            [
              "Input",
              "4 -2 *3"
            ],
            [
              "Totals",
              "+4 +2 +5"
            ],
            [
              "Total",
              "5"
            ]
          ]
        ]
      ],
      "idea": "An array stores values in index order. Read an existing index in O(1) time. To build a running sum, walk left to right and carry one number: the total of the values seen so far.",
      "pitfall": "Keep the indexing straight. The sum at index 0 includes the first value. The in-place solution changes the input, so use a new output list if another caller needs the original values.",
      "warmup": "Write a function that returns a fresh running-total list. Work through positive and negative numbers on paper before coding.",
      "warm": "def running_totals(values):\n    total = 0\n    result = []\n    for value in values:\n        total += value\n        result.append(total)\n    return result",
      "lc": "Replace each array value with the sum of the prefix ending at that position.",
      "hint": "The value to the left already holds a complete prefix sum.",
      "why": "At the start of iteration i, nums[i - 1] contains the previous prefix total. Adding it to the original nums[i] extends that total by one item. The first element already represents a prefix of length one.",
      "solution": "class Solution:\n    def runningSum(self, nums):\n        for i in range(1, len(nums)):\n            nums[i] += nums[i - 1]\n        return nums",
      "steps": [
        "Start the running total at zero.",
        "Add the current value before recording the new total.",
        "At index i, the recorded total equals the sum from index 0 through i. This is the invariant that makes the scan work."
      ],
      "cost": [
        [
          "Recompute every prefix",
          "O(n²)",
          "O(n) output",
          "The prefixes contain 1 + 2 + … + n values in total."
        ],
        [
          "Carry a running sum",
          "O(n)",
          "O(1) extra in place",
          "Each original value is read once. Updating the input is allowed for this solution."
        ]
      ],
      "recognize": "When an answer depends on all values seen so far, look for a state you can update with just the next value.",
      "checkpoint": [
        "Why is sum(values[:i+1]) expensive inside the loop even though the line contains no visible inner loop?",
        "Each call copies and sums a prefix of length i+1. Across all indices, the two operations each add up to quadratic work. Keeping one total avoids both repeated passes."
      ]
    },
    {
      "title": "Big O and nested loops",
      "slug": "contains-duplicate",
      "number": 217,
      "problem": "Contains Duplicate",
      "difficulty": "Easy",
      "category": "Foundation",
      "examples": [
        [
          "pair_checks([7, 4, 9, 2])",
          "6"
        ],
        [
          "pair_checks([7, 7, 2])",
          "1"
        ]
      ],
      "frames": [
        [
          "On four distinct values, the pair scan checks six pairs. Start a set-based scan with empty memory.",
          [
            [
              "Input",
              "7 4 9 2"
            ],
            [
              "Seen",
              "∅"
            ],
            [
              "Membership checks",
              "0"
            ]
          ]
        ],
        [
          "Check 7, then add it.",
          [
            [
              "Input",
              "*7 4 9 2"
            ],
            [
              "Seen",
              "+7"
            ],
            [
              "Membership checks",
              "1"
            ]
          ]
        ],
        [
          "Check 4, then add it.",
          [
            [
              "Input",
              "7 *4 9 2"
            ],
            [
              "Seen",
              "+7 +4"
            ],
            [
              "Membership checks",
              "2"
            ]
          ]
        ],
        [
          "Check 9, then add it.",
          [
            [
              "Input",
              "7 4 *9 2"
            ],
            [
              "Seen",
              "+7 +4 +9"
            ],
            [
              "Membership checks",
              "3"
            ]
          ]
        ],
        [
          "Check 2. Four membership checks suffice on this input.",
          [
            [
              "Input",
              "7 4 9 *2"
            ],
            [
              "Seen",
              "+7 +4 +9 +2"
            ],
            [
              "Membership checks",
              "4"
            ]
          ]
        ]
      ],
      "idea": "Big O describes how the resource cost grows with input size n. Count the work inside loops, including operations such as scanning a list for membership. Two sequential O(n) loops still give O(n) time. Comparing each distinct pair takes up to n(n−1)/2 checks.",
      "pitfall": "Big O drops constant factors, so n(n−1)/2 is O(n²). It is an upper growth bound, not a clock reading. An early return can improve a particular run without changing its worst-case growth.",
      "warmup": "Count how many comparisons an all-pairs duplicate scan makes on four distinct items. Then write the pair-based scan and verify its count on an all-distinct input.",
      "warm": "def pair_checks(values):\n    checks = 0\n    for i in range(len(values)):\n        for j in range(i + 1, len(values)):\n            checks += 1\n            if values[i] == values[j]:\n                return checks\n    return checks",
      "lc": "Determine whether any value appears at least twice.",
      "hint": "Ask whether you need to remember each previous value or only whether it has appeared.",
      "why": "Before reading x, seen contains exactly the distinct values to its left. A hit is a valid duplicate. If the loop finishes without a hit, every item was new at the time it appeared.",
      "solution": "class Solution:\n    def containsDuplicate(self, nums):\n        seen = set()\n        for x in nums:\n            if x in seen:\n                return True\n            seen.add(x)\n        return False",
      "steps": [
        "Name the input size and the operation you are counting.",
        "Count the worst case for pair comparison when no duplicate exists.",
        "Trade extra memory for fewer comparisons by remembering values in a set. Python set membership and insertion are expected O(1) per operation for these integer keys."
      ],
      "cost": [
        [
          "Compare every pair",
          "O(n²)",
          "O(1) extra",
          "Use j = i + 1 to avoid self-comparisons and repeated pairs."
        ],
        [
          "Track seen values",
          "O(n) expected",
          "O(n) extra",
          "Return as soon as the current value is already in the set."
        ]
      ],
      "recognize": "When code is short, count the work of library operations too. List membership can conceal a linear scan.",
      "checkpoint": [
        "If n doubles on an all-distinct input, how do pair checks and set membership checks grow?",
        "Pair checks go from n(n−1)/2 to n(2n−1), approaching four times as many. Membership checks double. Insertions also double."
      ]
    },
    {
      "title": "Hash maps and sets",
      "slug": "two-sum",
      "number": 1,
      "problem": "Two Sum",
      "difficulty": "Easy",
      "category": "Core pattern",
      "examples": [
        [
          "find_pair([8, 1, 6, 3], 9)",
          "[0, 1]"
        ],
        [
          "find_pair([1, 2], 10)",
          "[]"
        ]
      ],
      "frames": [
        [
          "Find two indices that sum to 9.",
          [
            [
              "Array",
              "2 7 11 15"
            ],
            [
              "Value → index",
              "∅"
            ],
            [
              "Target",
              "9"
            ]
          ]
        ],
        [
          "At index 0, need 7. The map is empty, so record 2 at index 0.",
          [
            [
              "Array",
              "*2 7 11 15"
            ],
            [
              "Value → index",
              "+2→0"
            ],
            [
              "Need",
              "7"
            ]
          ]
        ],
        [
          "At index 1, need 2. Look up 2 and find index 0.",
          [
            [
              "Array",
              "+2 *7 11 15"
            ],
            [
              "Value → index",
              "+2→0"
            ],
            [
              "Need",
              "+2"
            ]
          ]
        ],
        [
          "The selected indices are 0 and 1.",
          [
            [
              "Array",
              "+2 +7 11 15"
            ],
            [
              "Indices",
              "+0 +1"
            ],
            [
              "Sum",
              "+9"
            ]
          ]
        ]
      ],
      "idea": "A set tracks membership. A dictionary maps a key to a value. For a target sum T, the only partner of the current value x is T − x. Store previous values as keys and their indices as values so you can retrieve the partner quickly.",
      "pitfall": "LeetCode asks for indices. Inserting x before checking can accidentally pair an element with itself.",
      "warmup": "Return the first pair of indices you discover in a left-to-right scan whose values sum to the target. Return an empty list if no pair exists.",
      "warm": "def find_pair(values, target):\n    previous = {}\n    for index, value in enumerate(values):\n        partner = target - value\n        if partner in previous:\n            return [previous[partner], index]\n        previous[value] = index\n    return []",
      "lc": "Return two distinct indices whose values sum to target. The problem guarantees one valid pair.",
      "hint": "For nums[i] = 7 and target = 9, what single key should you look for?",
      "why": "The dictionary contains only earlier indices. When target − x is present, its stored index is distinct from i and the pair sums to target. A valid pair will be detected when its second element is visited.",
      "solution": "class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, x in enumerate(nums):\n            need = target - x\n            if need in seen:\n                return [seen[need], i]\n            seen[x] = i",
      "steps": [
        "Compute the complement target − x at each index.",
        "Look up the complement before inserting x.",
        "When found, return the earlier index and the current index. Looking up first also handles pairs such as [3, 3] with target 6."
      ],
      "cost": [
        [
          "Try every pair",
          "O(n²)",
          "O(1) extra",
          "Compare sums for every candidate pair until a match appears."
        ],
        [
          "Complement dictionary",
          "O(n) expected",
          "O(n) extra",
          "Store a previous index for each distinct value."
        ]
      ],
      "recognize": "When looking for a value that satisfies an equation with the current item, isolate the missing value and ask whether a dictionary can answer the lookup.",
      "checkpoint": [
        "Can you safely keep only the most recent index for each value in Two Sum?",
        "Yes. Every stored index is earlier than the current one. Any index for a needed value makes a valid pair. Returning all pairs would require storing more information."
      ]
    },
    {
      "title": "Strings and frequency counts",
      "slug": "valid-anagram",
      "number": 242,
      "problem": "Valid Anagram",
      "difficulty": "Easy",
      "category": "Core pattern",
      "examples": [
        [
          "frequencies('cocoa')",
          "{'c': 2, 'o': 2, 'a': 1}"
        ],
        [
          "frequencies('')",
          "{}"
        ]
      ],
      "frames": [
        [
          "Count the characters in “aab” before reading “aba”.",
          [
            [
              "Read",
              "a b a"
            ],
            [
              "Remaining",
              "a=2 b=1"
            ]
          ]
        ],
        [
          "Consume the first a. One a is still available.",
          [
            [
              "Read",
              "*a b a"
            ],
            [
              "Remaining",
              "*a=1 b=1"
            ]
          ]
        ],
        [
          "Consume b. The b count reaches zero.",
          [
            [
              "Read",
              "a *b a"
            ],
            [
              "Remaining",
              "a=1 +b=0"
            ]
          ]
        ],
        [
          "Consume the last a. Every count is zero.",
          [
            [
              "Read",
              "a b *a"
            ],
            [
              "Remaining",
              "+a=0 +b=0"
            ]
          ]
        ]
      ],
      "idea": "Strings are ordered and immutable in Python. When only multiplicities matter, turn each character into a counter. Anagrams have the same length and the same count for every character.",
      "pitfall": "A set loses multiplicity: \"aab\" and \"abb\" share a character set. This problem uses lowercase English letters. Case folding or Unicode normalization depends on the task requirements.",
      "warmup": "Build a dictionary that maps every character to its frequency. Include spaces if they appear in the input.",
      "warm": "def frequencies(text):\n    counts = {}\n    for char in text:\n        counts[char] = counts.get(char, 0) + 1\n    return counts",
      "lc": "Decide whether rearranging the characters of one string can produce the other.",
      "hint": "After counting the first string, treat the second as a series of requests to spend those counts.",
      "why": "A character can be consumed only while its count is positive. If all n characters are consumed and the lengths match, every count has been used exactly.",
      "solution": "class Solution:\n    def isAnagram(self, s, t):\n        if len(s) != len(t):\n            return False\n        counts = {}\n        for char in s:\n            counts[char] = counts.get(char, 0) + 1\n        for char in t:\n            if counts.get(char, 0) == 0:\n                return False\n            counts[char] -= 1\n        return True",
      "steps": [
        "Reject mismatched lengths.",
        "Count the characters in the first string.",
        "Consume those counts while reading the second string. A missing or exhausted character proves the strings differ."
      ],
      "cost": [
        [
          "Sort both strings",
          "O(n log n)",
          "O(n) extra",
          "Sort characters and compare the two ordered lists."
        ],
        [
          "Count characters",
          "O(n) expected",
          "O(k) extra",
          "k is the number of distinct characters in the first string."
        ]
      ],
      "recognize": "When order does not matter but repetition does, use counts. For a fixed 26-letter alphabet, a 26-element array is another option.",
      "checkpoint": [
        "What space bound can you state for lowercase English letters? What changes for arbitrary characters?",
        "At most 26 counters give O(1) auxiliary space under a fixed alphabet. For an unrestricted alphabet, the number of distinct characters can grow with n, so write O(k)."
      ]
    },
    {
      "title": "Two pointers",
      "slug": "two-sum-ii-input-array-is-sorted",
      "number": 167,
      "problem": "Two Sum II – Input Array Is Sorted",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "sorted_pair([1, 2, 4, 8, 11], 10)",
          "[1, 3]"
        ],
        [
          "sorted_pair([1, 3], 9)",
          "[]"
        ]
      ],
      "frames": [
        [
          "Set the pointers at the ends. The target is 10.",
          [
            [
              "Array",
              "*1 2 4 8 *11"
            ],
            [
              "Sum",
              "12"
            ],
            [
              "Move",
              "R←"
            ]
          ]
        ],
        [
          "1 + 8 is too small. Remove 1 from consideration.",
          [
            [
              "Array",
              "*1 2 4 *8 !11"
            ],
            [
              "Sum",
              "9"
            ],
            [
              "Move",
              "L→"
            ]
          ]
        ],
        [
          "2 + 8 equals 10. The one-based answer is [2, 4].",
          [
            [
              "Array",
              "!1 +2 4 +8 !11"
            ],
            [
              "Sum",
              "+10"
            ],
            [
              "Positions",
              "+2 +4"
            ]
          ]
        ]
      ],
      "idea": "Two pointers let you discard many candidates at once when data has an order. In a sorted array, the smallest available value and largest available value bound the possible pairs involving either endpoint.",
      "pitfall": "The pointer argument requires sorted values. The warm-up returns zero-based indices. LeetCode 167 expects one-based indices and guarantees a solution.",
      "warmup": "Return zero-based positions of two values in a sorted list that sum to a given target. Return [] if there is no pair.",
      "warm": "def sorted_pair(values, target):\n    left, right = 0, len(values) - 1\n    while left < right:\n        total = values[left] + values[right]\n        if total == target:\n            return [left, right]\n        if total < target:\n            left += 1\n        else:\n            right -= 1\n    return []",
      "lc": "Find the two one-based indices in a sorted array that sum to target. Use constant extra space.",
      "hint": "If the smallest candidate plus the largest is too big, which endpoint can never be part of a valid pair in the remaining interval?",
      "why": "At each iteration the algorithm discards an endpoint that cannot pair with any remaining element. This preserves the guaranteed solution until both endpoints form the target.",
      "solution": "class Solution:\n    def twoSum(self, numbers, target):\n        left, right = 0, len(numbers) - 1\n        while left < right:\n            total = numbers[left] + numbers[right]\n            if total == target:\n                return [left + 1, right + 1]\n            if total < target:\n                left += 1\n            else:\n                right -= 1",
      "steps": [
        "Start at the left and right ends of the sorted list.",
        "If the sum is too small, move left inward. Pairing the current left with any smaller right would also be too small.",
        "If the sum is too large, move right inward. Pairing the current right with any larger left would also be too large."
      ],
      "cost": [
        [
          "Compare every pair",
          "O(n²)",
          "O(1) extra",
          "A simple baseline that ignores sorted order."
        ],
        [
          "Walk inward",
          "O(n)",
          "O(1) extra",
          "Each step moves exactly one pointer toward the other."
        ]
      ],
      "recognize": "Look for sorted data, opposing bounds, and a comparison that proves one endpoint can be dropped.",
      "checkpoint": [
        "Why not sort an arbitrary input and apply the same pointer algorithm when the output asks for original positions?",
        "Sorting alone changes the positions. Preserve (value, original index) pairs if using this route. The resulting O(n log n) method differs from the expected O(n) dictionary solution."
      ]
    },
    {
      "title": "Sliding windows",
      "slug": "longest-substring-without-repeating-characters",
      "number": 3,
      "problem": "Longest Substring Without Repeating Characters",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "max_window([2, -1, 4, 3], 2)",
          "7"
        ],
        [
          "max_window([-5, -2], 1)",
          "-2"
        ]
      ],
      "frames": [
        [
          "Read a. The current valid window has length 1.",
          [
            [
              "String",
              "*a b b a"
            ],
            [
              "Window",
              "+a"
            ],
            [
              "Best",
              "1"
            ]
          ]
        ],
        [
          "Read b. The window ab has length 2.",
          [
            [
              "String",
              "+a *b b a"
            ],
            [
              "Window",
              "+a +b"
            ],
            [
              "Best",
              "2"
            ]
          ]
        ],
        [
          "The next b conflicts. Drop a and the earlier b, then add the new b.",
          [
            [
              "String",
              "!a !b *b a"
            ],
            [
              "Window",
              "+b"
            ],
            [
              "Best",
              "2"
            ]
          ]
        ],
        [
          "Read a. The new window ba ties the best length of 2.",
          [
            [
              "String",
              "!a !b +b *a"
            ],
            [
              "Window",
              "+b +a"
            ],
            [
              "Best",
              "+2"
            ]
          ]
        ]
      ],
      "idea": "A window is a contiguous range whose state you update as its boundaries move. A fixed window keeps its length. A variable window expands and shrinks to preserve a property, such as having no repeated character.",
      "pitfall": "A substring is contiguous. Update the answer only after restoring the no-duplicate property. If using a last-seen index shortcut, never move the left boundary backward.",
      "warmup": "Find the largest sum of exactly k consecutive numbers. Slide a fixed window by subtracting the exiting item and adding the entering item. Assume 1 ≤ k ≤ len(values).",
      "warm": "def max_window(values, k):\n    total = sum(values[i] for i in range(k))\n    best = total\n    for right in range(k, len(values)):\n        total += values[right] - values[right - k]\n        best = max(best, total)\n    return best",
      "lc": "Return the length of the longest contiguous substring containing no repeated character.",
      "hint": "The window was valid before adding s[right]. Which occurrence must leave to make it valid again?",
      "why": "The set stores the current window. Removing from the left until the new character is absent yields the longest valid suffix ending at right, so taking the maximum over all right endpoints finds the answer.",
      "solution": "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        left = best = 0\n        window = set()\n        for right, char in enumerate(s):\n            while char in window:\n                window.remove(s[left])\n                left += 1\n            window.add(char)\n            best = max(best, right - left + 1)\n        return best",
      "steps": [
        "Expand the right boundary by one item.",
        "Remove items from the left while the current item would duplicate an item in the window.",
        "Add the current item and update the best length. Both boundaries advance at most n times."
      ],
      "cost": [
        [
          "Try every start and expand afresh",
          "O(n²) expected",
          "O(k) extra",
          "Using a set per start avoids rechecking each full substring."
        ],
        [
          "Maintain one variable window",
          "O(n) expected",
          "O(k) extra",
          "k bounds the number of distinct characters."
        ]
      ],
      "recognize": "Look for contiguous ranges and a property you can maintain when one item enters or leaves.",
      "checkpoint": [
        "Why can a loop with an outer for and an inner while still be linear here?",
        "The inner loop spends one left-pointer move per iteration. Across the full scan, each character can enter once and leave once, so the total work is O(n) expected."
      ]
    },
    {
      "title": "Prefix sums",
      "slug": "subarray-sum-equals-k",
      "number": 560,
      "problem": "Subarray Sum Equals K",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "range_sums([3, -1, 4, 2], [(0, 2), (2, 3), (1, 1)])",
          "[6, 6, -1]"
        ],
        [
          "range_sums([], [])",
          "[]"
        ]
      ],
      "frames": [
        [
          "Count subarrays summing to 1. Seed the empty prefix with frequency 1.",
          [
            [
              "Values",
              "1 -1 1"
            ],
            [
              "Frequencies",
              "0×1"
            ],
            [
              "Count",
              "0"
            ]
          ]
        ],
        [
          "Prefix 1 needs a previous 0. Find one and record the new prefix.",
          [
            [
              "Values",
              "*1 -1 1"
            ],
            [
              "Frequencies",
              "+0×1 1×1"
            ],
            [
              "Count",
              "1"
            ]
          ]
        ],
        [
          "Prefix 0 needs −1. There are none. Record a second occurrence of 0.",
          [
            [
              "Values",
              "1 *-1 1"
            ],
            [
              "Frequencies",
              "*0×2 1×1"
            ],
            [
              "Count",
              "1"
            ]
          ]
        ],
        [
          "Prefix 1 needs 0 again. Two earlier zeros add two subarrays.",
          [
            [
              "Values",
              "1 -1 *1"
            ],
            [
              "Frequencies",
              "+0×2 1×2"
            ],
            [
              "Count",
              "+3"
            ]
          ]
        ]
      ],
      "idea": "Use P[0] = 0 and P[i + 1] = P[i] + values[i]. Then the sum over the half-open range [left, right) equals P[right] − P[left]. For a target k, each earlier prefix equal to current − k marks a qualifying start.",
      "pitfall": "A sum-based sliding window can fail when values are negative. Inserting before lookup also counts a zero-length subarray when k = 0.",
      "warmup": "Answer inclusive range-sum queries by building one prefix array. Assume each query satisfies 0 ≤ left ≤ right < len(values).",
      "warm": "def range_sums(values, queries):\n    prefix = [0]\n    for value in values:\n        prefix.append(prefix[-1] + value)\n    return [prefix[right + 1] - prefix[left] for left, right in queries]",
      "lc": "Count all non-empty contiguous subarrays whose sum equals k. The input may contain negative values.",
      "hint": "For an ending prefix P, how many earlier prefixes equal P − k?",
      "why": "Every matching earlier prefix corresponds to a distinct starting position. Querying before insertion prevents the current ending position from also being treated as a start.",
      "solution": "class Solution:\n    def subarraySum(self, nums, k):\n        frequency = {0: 1}\n        prefix = count = 0\n        for x in nums:\n            prefix += x\n            count += frequency.get(prefix - k, 0)\n            frequency[prefix] = frequency.get(prefix, 0) + 1\n        return count",
      "steps": [
        "Initialize the prefix-frequency map with one zero prefix.",
        "At each position, update the current prefix and count occurrences of current − k.",
        "Record the current prefix afterward. Count frequencies because several starts can share a prefix value."
      ],
      "cost": [
        [
          "Expand from every start",
          "O(n²)",
          "O(1) extra",
          "Maintain a running sum for each starting position."
        ],
        [
          "Prefix-frequency map",
          "O(n) expected",
          "O(n) extra",
          "Each end queries all qualifying starts at once."
        ]
      ],
      "recognize": "Look for many range totals or a target sum with negative values. Use differences between earlier cumulative totals.",
      "checkpoint": [
        "Why does the count map begin with {0: 1}?",
        "A qualifying subarray that starts at index 0 has the empty prefix as its starting boundary. The initial entry gives that boundary one occurrence."
      ]
    },
    {
      "title": "Sorting and merging",
      "slug": "sort-an-array",
      "number": 912,
      "problem": "Sort an Array",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "merge([1, 4, 4], [2, 3, 5])",
          "[1, 2, 3, 4, 4, 5]"
        ],
        [
          "merge([], [2])",
          "[2]"
        ]
      ],
      "frames": [
        [
          "Split the input [5, 2, 3, 1] until each run has one value.",
          [
            [
              "Left half",
              "5 2"
            ],
            [
              "Right half",
              "3 1"
            ],
            [
              "Output",
              "· · · ·"
            ]
          ]
        ],
        [
          "Merge the single-value runs into sorted halves.",
          [
            [
              "Left half",
              "+2 +5"
            ],
            [
              "Right half",
              "+1 +3"
            ],
            [
              "Output",
              "· · · ·"
            ]
          ]
        ],
        [
          "Compare 2 with 1. Take 1 first.",
          [
            [
              "Left half",
              "*2 5"
            ],
            [
              "Right half",
              "!1 *3"
            ],
            [
              "Output",
              "+1 · · ·"
            ]
          ]
        ],
        [
          "Compare 2 with 3. Take 2.",
          [
            [
              "Left half",
              "!2 *5"
            ],
            [
              "Right half",
              "!1 *3"
            ],
            [
              "Output",
              "+1 +2 · ·"
            ]
          ]
        ],
        [
          "Take 3, then append 5 from the remaining half.",
          [
            [
              "Left half",
              "!2 !5"
            ],
            [
              "Right half",
              "!1 !3"
            ],
            [
              "Output",
              "+1 +2 +3 +5"
            ]
          ]
        ]
      ],
      "idea": "Sorting can expose order for later scans and binary searches. Merge sort splits the array into halves, sorts each half, and merges them in linear time. Choosing the left value on ties makes this implementation stable.",
      "pitfall": "The merge assumes both input lists are sorted. Remember to drain whichever half still has values after the main loop.",
      "warmup": "Merge two sorted lists into a new sorted list. Keep all repeated values.",
      "warm": "def merge(left, right):\n    i = j = 0\n    result = []\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result",
      "lc": "Sort an integer array in ascending order. Implement an O(n log n) algorithm without using a built-in sort.",
      "hint": "Practice the two-list merge first. Then make recursion supply the two sorted halves.",
      "why": "Single-element ranges are sorted. By induction, recursive calls sort both halves. Each merge writes the least remaining element, giving a sorted range of the original elements.",
      "solution": "class Solution:\n    def sortArray(self, nums):\n        buffer = [0] * len(nums)\n\n        def sort(left, right):\n            if right - left <= 1:\n                return\n            mid = (left + right) // 2\n            sort(left, mid)\n            sort(mid, right)\n            i, j = left, mid\n            for out in range(left, right):\n                if i < mid and (j == right or nums[i] <= nums[j]):\n                    buffer[out] = nums[i]\n                    i += 1\n                else:\n                    buffer[out] = nums[j]\n                    j += 1\n            nums[left:right] = buffer[left:right]\n\n        sort(0, len(nums))\n        return nums",
      "steps": [
        "Recursively split into half-open ranges [left, right).",
        "Merge by repeatedly taking the smaller front value from two sorted halves.",
        "Reuse a buffer and copy the merged range back. Each level processes n items and there are O(log n) levels."
      ],
      "cost": [
        [
          "Insertion sort",
          "O(n²) worst case",
          "O(1) extra in place",
          "Reverse order can require shifting every already sorted item."
        ],
        [
          "Merge sort",
          "O(n log n)",
          "O(n) extra",
          "Use a buffer and O(log n) call stack. The buffer dominates memory."
        ]
      ],
      "recognize": "Use insertion sort to practice in-place shifts and merge sort for a predictable O(n log n) bound. Quicksort partitions in place with typical O(n log n) time, but unbalanced pivots can lead to O(n²).",
      "checkpoint": [
        "Why does halving the array lead to n log n work instead of log n work?",
        "Each level still merges every item once across its disjoint ranges, costing O(n). There are O(log n) levels. The two recursive calls distinguish sorting from binary search."
      ]
    },
    {
      "title": "Binary search",
      "slug": "binary-search",
      "number": 704,
      "problem": "Binary Search",
      "difficulty": "Easy",
      "category": "Core pattern",
      "examples": [
        [
          "lower_bound([1, 3, 3, 5], 3)",
          "1"
        ],
        [
          "lower_bound([1, 3, 3, 5], 7)",
          "4"
        ],
        [
          "lower_bound([], 2)",
          "0"
        ]
      ],
      "frames": [
        [
          "Find target 9. Start with the whole array.",
          [
            [
              "Array",
              "-1 0 3 5 9 12"
            ],
            [
              "Bounds",
              "L=0 R=5"
            ]
          ]
        ],
        [
          "Mid is 2, whose value 3 is too small. Eliminate indices 0 through 2.",
          [
            [
              "Array",
              "-1 0 *3 5 9 12"
            ],
            [
              "Bounds",
              "L=0 M=2 R=5"
            ]
          ]
        ],
        [
          "The remaining interval is [3, 5]. Mid is 4 and the value equals 9.",
          [
            [
              "Array",
              "!-1 !0 !3 5 +9 12"
            ],
            [
              "Bounds",
              "L=3 +M=4 R=5"
            ]
          ]
        ],
        [
          "Return index 4.",
          [
            [
              "Array",
              "!-1 !0 !3 5 +9 12"
            ],
            [
              "Index",
              "+4"
            ]
          ]
        ]
      ],
      "idea": "On sorted data, a middle comparison eliminates roughly half the remaining positions. The interval invariant is simple: if the target exists, it remains between left and right, inclusive.",
      "pitfall": "Use one interval convention consistently. Closed bounds use left ≤ right and discard mid on each failed comparison. For repeated values, first occurrence requires a lower-bound variant.",
      "warmup": "Find the first position whose value is at least the target. Return len(values) if no value qualifies. Use a half-open search interval.",
      "warm": "def lower_bound(values, target):\n    left, right = 0, len(values)\n    while left < right:\n        mid = (left + right) // 2\n        if values[mid] < target:\n            left = mid + 1\n        else:\n            right = mid\n    return left",
      "lc": "Find the index of a target in a sorted array of distinct integers. Return −1 if absent.",
      "hint": "A middle value below target eliminates every index at or to the left of mid.",
      "why": "Sorted order justifies both eliminations. Each missed midpoint is removed from the closed interval, ensuring termination and preserving any possible answer.",
      "solution": "class Solution:\n    def search(self, nums, target):\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = left + (right - left) // 2\n            if nums[mid] == target:\n                return mid\n            if nums[mid] < target:\n                left = mid + 1\n            else:\n                right = mid - 1\n        return -1",
      "steps": [
        "While left ≤ right, compare nums[mid] to the target.",
        "If the middle value is smaller, move left to mid + 1. If it is larger, move right to mid − 1.",
        "Return the middle index on equality. Return −1 once the candidate interval is empty."
      ],
      "cost": [
        [
          "Linear scan",
          "O(n)",
          "O(1) extra",
          "Works on unsorted arrays too."
        ],
        [
          "Binary search",
          "O(log n)",
          "O(1) extra",
          "The search space shrinks by a constant factor at every step."
        ]
      ],
      "recognize": "Look for an ordered search space with constant-time access to a midpoint.",
      "checkpoint": [
        "On [1, 3, 3, 3, 5], why might exact binary search return a different position from lower_bound?",
        "Exact search can stop at any matching midpoint. Lower bound retains mid when it qualifies and keeps searching for the first qualifying index, which is 1."
      ]
    },
    {
      "title": "Binary search on the answer",
      "slug": "koko-eating-bananas",
      "number": 875,
      "problem": "Koko Eating Bananas",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "hours_needed([5, 4], 3)",
          "4"
        ],
        [
          "hours_needed([3, 6, 7, 11], 4)",
          "8"
        ]
      ],
      "frames": [
        [
          "Piles [3, 6, 7, 11], limit 8 hours. Speed 11 works.",
          [
            [
              "Piles",
              "3 6 7 11"
            ],
            [
              "Speeds",
              "L=1 R=11"
            ],
            [
              "Limit",
              "8"
            ]
          ]
        ],
        [
          "Speed 6 needs 1 + 1 + 2 + 2 = 6 hours. Keep 6 as the upper bound.",
          [
            [
              "Speeds",
              "L=1 *M=6 R=11"
            ],
            [
              "Hours per pile",
              "1 1 2 2"
            ],
            [
              "Total",
              "+6"
            ]
          ]
        ],
        [
          "Speed 3 needs 1 + 2 + 3 + 4 = 10 hours. Raise the lower bound to 4.",
          [
            [
              "Speeds",
              "L=1 *M=3 R=6"
            ],
            [
              "Hours per pile",
              "1 2 3 4"
            ],
            [
              "Total",
              "!10"
            ]
          ]
        ],
        [
          "Speed 5 needs 1 + 2 + 2 + 3 = 8 hours. Keep 5.",
          [
            [
              "Speeds",
              "L=4 *M=5 R=6"
            ],
            [
              "Hours per pile",
              "1 2 2 3"
            ],
            [
              "Total",
              "+8"
            ]
          ]
        ],
        [
          "Speed 4 also needs 8 hours. Both bounds now equal 4.",
          [
            [
              "Speeds",
              "+L=4 +R=4"
            ],
            [
              "Hours per pile",
              "1 2 2 3"
            ],
            [
              "Answer",
              "+4"
            ]
          ]
        ]
      ],
      "idea": "Binary search can find an answer even without a sorted array. It needs a monotone predicate. If speed s finishes in time, every larger speed also works.",
      "pitfall": "Summing piles and rounding once underestimates the hours. Koko can work on only one pile in an hour, so each pile needs its own ceiling.",
      "warmup": "Compute the hours required to finish a list of piles at a fixed positive speed, rounding each pile upward separately.",
      "warm": "def hours_needed(piles, speed):\n    return sum((pile + speed - 1) // speed for pile in piles)",
      "lc": "Find the smallest integer eating speed that can finish all piles within h hours.",
      "hint": "At speed max(piles), each pile takes exactly one hour. The constraints make that speed feasible.",
      "why": "The hours function never increases as speed rises. The first feasible speed stays within the search interval as it contracts. When its endpoints meet, that speed is the answer.",
      "solution": "class Solution:\n    def minEatingSpeed(self, piles, h):\n        left, right = 1, max(piles)\n        while left < right:\n            speed = (left + right) // 2\n            hours = sum((pile + speed - 1) // speed for pile in piles)\n            if hours <= h:\n                right = speed\n            else:\n                left = speed + 1\n        return left",
      "steps": [
        "Choose a lower bound and a known feasible upper bound.",
        "Evaluate a candidate with integer ceiling division (pile + speed − 1) // speed.",
        "Keep mid as a possible answer when feasible. Otherwise every speed through mid is infeasible."
      ],
      "cost": [
        [
          "Try every speed",
          "O(nM)",
          "O(1) extra",
          "M is the maximum pile size."
        ],
        [
          "Find the first feasible speed",
          "O(n log M) for M ≥ 2",
          "O(1) extra",
          "The one-time max scan is O(n). Each predicate scans the piles."
        ]
      ],
      "recognize": "Look for a feasibility check with a single false-to-true or true-to-false transition across candidate answers.",
      "checkpoint": [
        "Why keep mid when its speed works?",
        "It could be the smallest feasible speed. Setting right to mid preserves that possibility. Setting right to mid−1 would require separately tracking the best feasible answer."
      ]
    },
    {
      "title": "Stacks",
      "slug": "valid-parentheses",
      "number": 20,
      "problem": "Valid Parentheses",
      "difficulty": "Easy",
      "category": "Data structure",
      "examples": [
        [
          "depth('(()())')",
          "2"
        ],
        [
          "depth('()()')",
          "1"
        ],
        [
          "depth('')",
          "0"
        ]
      ],
      "frames": [
        [
          "Read an opening parenthesis and push it.",
          [
            [
              "Read",
              "*( [ ] )"
            ],
            [
              "Stack (top at right)",
              "+("
            ]
          ]
        ],
        [
          "Read an opening square bracket and push it.",
          [
            [
              "Read",
              "( *[ ] )"
            ],
            [
              "Stack (top at right)",
              "( +["
            ]
          ]
        ],
        [
          "The closing square bracket matches the top. Pop the opener.",
          [
            [
              "Read",
              "( [ *] )"
            ],
            [
              "Stack (top at right)",
              "+("
            ]
          ]
        ],
        [
          "The closing parenthesis matches the top. An empty stack means valid.",
          [
            [
              "Read",
              "( [ ] *)"
            ],
            [
              "Stack (top at right)",
              "+∅"
            ],
            [
              "Result",
              "+valid"
            ]
          ]
        ]
      ],
      "idea": "A stack is last in, first out. The most recent unmatched opening bracket must be the next bracket closed. A Python list supports amortized O(1) append and O(1) pop from the end.",
      "pitfall": "Check whether the stack is empty before popping. A count of brackets alone cannot distinguish [()] from ([)].",
      "warmup": "Return the maximum nesting depth of a valid string containing only parentheses.",
      "warm": "def depth(text):\n    stack = []\n    maximum = 0\n    for char in text:\n        if char == '(':\n            stack.append(char)\n            maximum = max(maximum, len(stack))\n        else:\n            stack.pop()\n    return maximum",
      "lc": "Check whether every bracket closes the most recent opener of the same type, with no unmatched brackets remaining.",
      "hint": "Use a dictionary from each closer to the opener it expects.",
      "why": "The stack represents unmatched openers in encounter order. Checking the top enforces proper nesting. The final emptiness test rejects leftover openers.",
      "solution": "class Solution:\n    def isValid(self, s):\n        opening_for = {')': '(', ']': '[', '}': '{'}\n        stack = []\n        for char in s:\n            if char in opening_for:\n                if not stack or stack.pop() != opening_for[char]:\n                    return False\n            else:\n                stack.append(char)\n        return not stack",
      "steps": [
        "Push opening brackets onto the stack.",
        "For a closing bracket, check that the top is the matching opener, then pop it.",
        "At the end, the stack must be empty."
      ],
      "cost": [
        [
          "Repeatedly remove adjacent pairs",
          "O(n²) worst case",
          "O(n) extra",
          "Nested input can require many full string passes and copies."
        ],
        [
          "Track unmatched openers",
          "O(n)",
          "O(n) extra",
          "Each symbol is pushed or matched once."
        ]
      ],
      "recognize": "Look for nested structure, undo operations, or a task that always needs the most recent unresolved item.",
      "checkpoint": [
        "Why does the input “([)]” fail even though all opener and closer counts match?",
        "The first closer is “)”, while the most recent opener is “[”. A stack preserves the order that a frequency counter discards."
      ]
    },
    {
      "title": "Monotonic stacks",
      "slug": "daily-temperatures",
      "number": 739,
      "problem": "Daily Temperatures",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "next_greater([2, 1, 2, 4])",
          "[4, 2, 4, None]"
        ],
        [
          "next_greater([5, 5])",
          "[None, None]"
        ]
      ],
      "frames": [
        [
          "Day 0 has temperature 72. Store index 0.",
          [
            [
              "Temperatures",
              "*72 70 71 74"
            ],
            [
              "Pending indices",
              "0"
            ],
            [
              "Answer",
              "0 0 0 0"
            ]
          ]
        ],
        [
          "Day 1 is cooler. Push index 1.",
          [
            [
              "Temperatures",
              "72 *70 71 74"
            ],
            [
              "Pending indices",
              "0 +1"
            ],
            [
              "Answer",
              "0 0 0 0"
            ]
          ]
        ],
        [
          "Day 2 resolves index 1 after one day. Index 0 stays pending.",
          [
            [
              "Temperatures",
              "72 70 *71 74"
            ],
            [
              "Pending indices",
              "0 +2"
            ],
            [
              "Answer",
              "0 +1 0 0"
            ]
          ]
        ],
        [
          "Day 3 resolves indices 2 and 0. Index 3 remains unresolved.",
          [
            [
              "Temperatures",
              "72 70 71 *74"
            ],
            [
              "Pending indices",
              "3"
            ],
            [
              "Answer",
              "+3 +1 +1 0"
            ]
          ]
        ]
      ],
      "idea": "A monotonic stack keeps pending candidates in an ordered sequence. To find the next strictly warmer day, store unresolved indices in non-increasing order of their temperatures.",
      "pitfall": "Equal temperatures do not count as warmer. Store indices because the answer is a distance, and temperatures can repeat.",
      "warmup": "For each list element, return the next strictly greater value to its right. Use None when there is no such value.",
      "warm": "def next_greater(values):\n    pending = []\n    result = [None] * len(values)\n    for index, value in enumerate(values):\n        while pending and values[pending[-1]] < value:\n            result[pending.pop()] = value\n        pending.append(index)\n    return result",
      "lc": "For each day, report how many days until a strictly higher temperature. Leave zero when no later day is warmer.",
      "hint": "A single warm day may settle several pending indices.",
      "why": "When today first exceeds an unresolved temperature, all colder pending indices above it are popped first. That index is then popped today, so the recorded distance is to its first warmer day.",
      "solution": "class Solution:\n    def dailyTemperatures(self, temperatures):\n        result = [0] * len(temperatures)\n        stack = []\n        for today, value in enumerate(temperatures):\n            while stack and temperatures[stack[-1]] < value:\n                earlier = stack.pop()\n                result[earlier] = today - earlier\n            stack.append(today)\n        return result",
      "steps": [
        "Scan from left to right.",
        "While today's temperature exceeds the top index's temperature, pop that index and record the distance to today.",
        "Push today's index. Any indices still pending at the end keep answer zero."
      ],
      "cost": [
        [
          "Scan forward from each day",
          "O(n²) worst case",
          "O(1) extra beyond output",
          "A long cooling sequence forces many checks."
        ],
        [
          "Monotonic index stack",
          "O(n)",
          "O(n) extra",
          "Each index is pushed once and popped at most once, even with a nested while loop."
        ]
      ],
      "recognize": "Look for the next strictly greater or smaller element, or for a boundary that invalidates several pending indices at once.",
      "checkpoint": [
        "What changes if the task asks for the next warmer-or-equal day?",
        "Pop while the top temperature is less than or equal to today's. The equality case changes the maintained order and lets equal days resolve."
      ]
    },
    {
      "title": "Queues and monotonic deques",
      "slug": "sliding-window-maximum",
      "number": 239,
      "problem": "Sliding Window Maximum",
      "difficulty": "Hard",
      "category": "Stretch",
      "examples": [
        [
          "serve_tickets(['serve', 'A', 'B', 'serve', 'C', 'serve'])",
          "['A', 'B']"
        ],
        [
          "serve_tickets(['serve'])",
          "[]"
        ]
      ],
      "frames": [
        [
          "Use k = 3. Add index 0 to the deque.",
          [
            [
              "Array",
              "*1 3 -1 -3 5"
            ],
            [
              "Deque (front at left)",
              "0→1"
            ],
            [
              "Maxima",
              "∅"
            ]
          ]
        ],
        [
          "Value 3 dominates 1. Drop index 0 and add index 1.",
          [
            [
              "Array",
              "1 *3 -1 -3 5"
            ],
            [
              "Deque (front at left)",
              "+1→3"
            ],
            [
              "Maxima",
              "∅"
            ]
          ]
        ],
        [
          "Add −1. The first full window has maximum 3.",
          [
            [
              "Array",
              "+1 +3 *-1 -3 5"
            ],
            [
              "Deque (front at left)",
              "+1→3 2→−1"
            ],
            [
              "Maxima",
              "+3"
            ]
          ]
        ],
        [
          "Add −3. Index 1 is still inside [1, 3].",
          [
            [
              "Array",
              "!1 +3 +-1 *-3 5"
            ],
            [
              "Deque (front at left)",
              "+1→3 2→−1 3→−3"
            ],
            [
              "Maxima",
              "+3 +3"
            ]
          ]
        ],
        [
          "Index 1 expires. Value 5 dominates the other candidates.",
          [
            [
              "Array",
              "!1 !3 +-1 +-3 *5"
            ],
            [
              "Deque (front at left)",
              "+4→5"
            ],
            [
              "Maxima",
              "+3 +3 +5"
            ]
          ]
        ]
      ],
      "idea": "A queue removes from the front and inserts at the back. A deque also supports the other two end operations in O(1) time. Keep decreasing candidate values in a deque so its front always supplies the window maximum.",
      "pitfall": "Use collections.deque, since list.pop(0) shifts remaining items. Store indices so expiration works even with duplicate values.",
      "warmup": "Simulate a FIFO ticket counter. For each operation, append a ticket ID unless the operation equals 'serve'. Return served ticket IDs, skipping service when the queue is empty.",
      "warm": "from collections import deque\n\ndef serve_tickets(operations):\n    queue = deque()\n    served = []\n    for operation in operations:\n        if operation != 'serve':\n            queue.append(operation)\n        elif queue:\n            served.append(queue.popleft())\n    return served",
      "lc": "Return the maximum of each contiguous window of width k.",
      "hint": "If a newer value is greater than an older value in the same window, the older value will never become the maximum of a future window containing it.",
      "why": "Every index in the deque is in range and ordered by decreasing value. Each removed candidate was expired or dominated by a later candidate. The front is therefore the maximum of each full window.",
      "solution": "from collections import deque\n\nclass Solution:\n    def maxSlidingWindow(self, nums, k):\n        candidates = deque()\n        result = []\n        for right, value in enumerate(nums):\n            if candidates and candidates[0] <= right - k:\n                candidates.popleft()\n            while candidates and nums[candidates[-1]] <= value:\n                candidates.pop()\n            candidates.append(right)\n            if right >= k - 1:\n                result.append(nums[candidates[0]])\n        return result",
      "steps": [
        "Remove a front index if it is outside the current window.",
        "Remove back indices whose values are at most the new value. The new value is as good and expires later.",
        "Append the new index and read the front when the window first reaches size k."
      ],
      "cost": [
        [
          "Scan each window for its maximum",
          "O(nk)",
          "O(1) extra beyond output",
          "Windows repeat much of the same work."
        ],
        [
          "Monotonic deque",
          "O(n)",
          "O(k) extra",
          "Each index enters once and leaves at most once."
        ]
      ],
      "recognize": "Use a FIFO queue for arrival order. Use a monotonic deque when an ordered maximum or minimum must be updated as a window slides.",
      "checkpoint": [
        "Why can you discard an older equal value when a new equal value arrives?",
        "The new candidate supplies the same maximum and expires later. Every future window that still contains the old one also contains the new one."
      ]
    },
    {
      "title": "Linked lists",
      "slug": "reverse-linked-list",
      "number": 206,
      "problem": "Reverse Linked List",
      "difficulty": "Easy",
      "category": "Data structure",
      "examples": [
        [
          "reverse_links({'A': 'B', 'B': 'C', 'C': None}, 'A')",
          "('C', {'A': None, 'B': 'A', 'C': 'B'})"
        ],
        [
          "reverse_links({}, None)",
          "(None, {})"
        ]
      ],
      "frames": [
        [
          "Start with no reversed nodes and all nodes untouched.",
          [
            [
              "Reversed prefix",
              "∅"
            ],
            [
              "Remaining chain",
              "*A → B → C"
            ]
          ]
        ],
        [
          "Save B, then point A to None.",
          [
            [
              "Reversed prefix",
              "+A → ∅"
            ],
            [
              "Remaining chain",
              "*B → C"
            ]
          ]
        ],
        [
          "Save C, then point B to A.",
          [
            [
              "Reversed prefix",
              "+B → A → ∅"
            ],
            [
              "Remaining chain",
              "*C"
            ]
          ]
        ],
        [
          "Point C to B. The remaining chain is empty, so C is the new head.",
          [
            [
              "Reversed prefix",
              "+C → B → A → ∅"
            ],
            [
              "Remaining chain",
              "∅"
            ]
          ]
        ]
      ],
      "idea": "A singly linked node holds a value and a reference to its next node. To reverse a list, redirect one reference at a time. Save the next node before overwriting the link so you can still reach the unprocessed suffix.",
      "pitfall": "Do not overwrite curr.next before saving it. Return the new head, even for an empty list. The LeetCode environment provides the ListNode class.",
      "warmup": "Use a dictionary to model links between node labels. Reverse its links in place and return the new head. A None link marks the end.",
      "warm": "def reverse_links(links, head):\n    previous = None\n    current = head\n    while current is not None:\n        following = links[current]\n        links[current] = previous\n        previous, current = current, following\n    return previous, links",
      "lc": "Reverse the links in a singly linked list and return its new head.",
      "hint": "Draw two chains: the reversed prefix and the untouched suffix.",
      "why": "Each iteration moves the first suffix node to the front of the reversed prefix. The saved next reference retains the suffix. At termination the suffix is empty and prev heads the reversed list.",
      "solution": "class Solution:\n    def reverseList(self, head):\n        prev, curr = None, head\n        while curr is not None:\n            next_node = curr.next\n            curr.next = prev\n            prev, curr = curr, next_node\n        return prev",
      "steps": [
        "Start with prev = None and curr at the head.",
        "Save curr.next. Redirect curr.next to prev.",
        "Advance prev to curr and curr to the saved node. When curr becomes None, prev is the new head."
      ],
      "cost": [
        [
          "Stack the nodes, then relink",
          "O(n)",
          "O(n) extra",
          "A stack supplies nodes in reverse order."
        ],
        [
          "Reverse links in one pass",
          "O(n)",
          "O(1) extra",
          "Only three node references are needed at a time."
        ]
      ],
      "recognize": "Use links when you need to rewire a sequence from known nodes. Finding an arbitrary index still takes a traversal.",
      "checkpoint": [
        "At any step of reversal, what three references keep the procedure safe?",
        "prev heads the reversed prefix, curr heads the unprocessed suffix, and next_node preserves the remainder before curr.next is overwritten."
      ]
    },
    {
      "title": "Fast and slow pointers",
      "slug": "linked-list-cycle",
      "number": 141,
      "problem": "Linked List Cycle",
      "difficulty": "Easy",
      "category": "Core pattern",
      "examples": [
        [
          "middle_index([1, 2, 3, None])",
          "2"
        ],
        [
          "middle_index([None])",
          "0"
        ]
      ],
      "frames": [
        [
          "A leads to B, then C, then D, and D loops back to B.",
          [
            [
              "Nodes",
              "*A B C D"
            ],
            [
              "Pointers",
              "S=A F=A"
            ]
          ]
        ],
        [
          "After one turn, slow is at B and fast is at C.",
          [
            [
              "Nodes",
              "A *B *C D"
            ],
            [
              "Pointers",
              "S=B F=C"
            ]
          ]
        ],
        [
          "After two turns, slow is at C and fast is at B.",
          [
            [
              "Nodes",
              "A *B *C D"
            ],
            [
              "Pointers",
              "S=C F=B"
            ]
          ]
        ],
        [
          "After three turns, both are at D. A cycle exists.",
          [
            [
              "Nodes",
              "A B C +D"
            ],
            [
              "Pointers",
              "+S=D +F=D"
            ]
          ]
        ]
      ],
      "idea": "Floyd's cycle detection uses pointers with different speeds. Once both are inside a cycle, fast gains one position per iteration modulo the cycle length. It must eventually catch slow.",
      "pitfall": "Compare node identity with is. Different nodes can hold equal values. Check fast and fast.next before advancing fast twice.",
      "warmup": "Find the middle index of a chain described by an array of next indices. Start at index 0 and use None for the end. Assume the chain is non-empty and acyclic. For even length, return the second middle.",
      "warm": "def middle_index(links):\n    slow = fast = 0\n    while fast is not None and links[fast] is not None:\n        slow = links[slow]\n        fast = links[links[fast]]\n    return slow",
      "lc": "Determine whether following next references eventually revisits a node.",
      "hint": "Once both pointers enter a cycle, how does the distance between them change each turn?",
      "why": "On an acyclic list fast reaches the end. On a cyclic list the relative distance decreases by one modulo the cycle size, so it eventually becomes zero.",
      "solution": "class Solution:\n    def hasCycle(self, head):\n        slow = fast = head\n        while fast is not None and fast.next is not None:\n            slow = slow.next\n            fast = fast.next.next\n            if slow is fast:\n                return True\n        return False",
      "steps": [
        "Start both pointers at the head.",
        "Move slow one step and fast two steps, checking that both fast steps are safe.",
        "Return True if both references point to the same node after moving. Return False when fast reaches the end."
      ],
      "cost": [
        [
          "Remember node identities",
          "O(n)",
          "O(n) extra",
          "Stop when you revisit a node or hit the end."
        ],
        [
          "Fast and slow pointers",
          "O(n)",
          "O(1) extra",
          "If a cycle exists, the pointers meet within one lap after both enter it."
        ]
      ],
      "graph": [
        [
          "A,13,45",
          "B,36,45",
          "C,70,20",
          "D,70,76"
        ],
        [
          "A>B",
          "B>C",
          "C>D",
          "D>B"
        ]
      ],
      "recognize": "Look for repeated traversal where next pointers are the only access, or where one pointer should cover twice the distance of another.",
      "checkpoint": [
        "Why is comparing node values insufficient to detect a cycle?",
        "Different nodes can store equal values. A cycle is a repeated reference to the same node. Identity comparisons detect that event."
      ]
    },
    {
      "title": "Recursion and backtracking",
      "slug": "subsets",
      "number": 78,
      "problem": "Subsets",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "binary_strings(2)",
          "['00', '01', '10', '11']"
        ],
        [
          "binary_strings(0)",
          "['']"
        ]
      ],
      "frames": [
        [
          "Record the empty path before trying any choices.",
          [
            [
              "Available",
              "1 2"
            ],
            [
              "Path",
              "∅"
            ],
            [
              "Output",
              "+[]"
            ]
          ]
        ],
        [
          "Pick 1 and record the new path.",
          [
            [
              "Available",
              "!1 2"
            ],
            [
              "Path",
              "*1"
            ],
            [
              "Output",
              "[] +[1]"
            ]
          ]
        ],
        [
          "From [1], pick 2. Record [1, 2].",
          [
            [
              "Available",
              "!1 !2"
            ],
            [
              "Path",
              "1 *2"
            ],
            [
              "Output",
              "[] [1] +[1,2]"
            ]
          ]
        ],
        [
          "Pop 2, then pop 1 to restore the root's empty path.",
          [
            [
              "Available",
              "1 2"
            ],
            [
              "Path",
              "∅"
            ],
            [
              "Output",
              "[] [1] [1,2]"
            ]
          ]
        ],
        [
          "Try 2 as the first choice. Record [2].",
          [
            [
              "Available",
              "!1 !2"
            ],
            [
              "Path",
              "*2"
            ],
            [
              "Output",
              "[] [1] [1,2] +[2]"
            ]
          ]
        ]
      ],
      "idea": "Recursion solves a smaller problem by calling the same function. Backtracking explores choices and restores shared state before exploring siblings. A subset can be built by choosing the next index from the unused suffix.",
      "pitfall": "Append path.copy(), since path itself will change. Output size is exponential, so no algorithm can enumerate all subsets in polynomial time.",
      "warmup": "Generate all length-n strings of 0s and 1s. Explore 0 before 1. Assume n is nonnegative.",
      "warm": "def binary_strings(n):\n    result, path = [], []\n    def visit():\n        if len(path) == n:\n            result.append(''.join(path))\n            return\n        for bit in '01':\n            path.append(bit)\n            visit()\n            path.pop()\n    visit()\n    return result",
      "lc": "List every subset of distinct input values, including the empty set.",
      "hint": "At each call, save the subset already built. Then explore adding each remaining value once.",
      "why": "Each subset corresponds to one increasing sequence of indices. The loop explores exactly those sequences and undoing a choice restores the path for siblings.",
      "solution": "class Solution:\n    def subsets(self, nums):\n        result, path = [], []\n\n        def visit(start):\n            result.append(path.copy())\n            for i in range(start, len(nums)):\n                path.append(nums[i])\n                visit(i + 1)\n                path.pop()\n\n        visit(0)\n        return result",
      "steps": [
        "Record a copy of the current path, including the empty subset.",
        "For each allowed next index, append its value and recurse from the following index.",
        "Pop that choice before the next branch. Increasing indices generate each subset once for distinct inputs."
      ],
      "cost": [
        [
          "Copy subsets at each doubling step",
          "O(n × 2ⁿ)",
          "O(n × 2ⁿ) output",
          "Start with [[]] and add each new element to a copy of every existing subset."
        ],
        [
          "Backtrack with one mutable path",
          "O(n × 2ⁿ)",
          "O(n) extra beyond output",
          "There are 2ⁿ subsets and their total length is n × 2ⁿ⁻¹ for n ≥ 1."
        ]
      ],
      "recognize": "Use backtracking when you must enumerate decision paths. List the choices and ask what state needs to be restored after each branch.",
      "checkpoint": [
        "Why is O(n × 2ⁿ) time reasonable for listing all subsets?",
        "The total number of stored element references is n × 2ⁿ⁻¹ for n ≥ 1. Even an ideal enumerator must write that much output."
      ]
    },
    {
      "title": "Binary tree DFS",
      "slug": "maximum-depth-of-binary-tree",
      "number": 104,
      "problem": "Maximum Depth of Binary Tree",
      "difficulty": "Easy",
      "category": "Data structure",
      "examples": [
        [
          "inorder((4, (2, None, None), (7, None, None)))",
          "[2, 4, 7]"
        ],
        [
          "inorder(None)",
          "[]"
        ]
      ],
      "frames": [
        [
          "Start at root 3 with depth 1. The stack top is at the right.",
          [
            [
              "Nodes",
              "*3 9 20 15 7"
            ],
            [
              "Stack",
              "3@1"
            ],
            [
              "Best",
              "0"
            ]
          ]
        ],
        [
          "Pop 3, then push right child 20 and left child 9.",
          [
            [
              "Nodes",
              "+3 *9 20 15 7"
            ],
            [
              "Stack",
              "20@2 9@2"
            ],
            [
              "Best",
              "1"
            ]
          ]
        ],
        [
          "Visit leaf 9 at depth 2. Next pop node 20.",
          [
            [
              "Nodes",
              "+3 +9 *20 15 7"
            ],
            [
              "Stack",
              "20@2"
            ],
            [
              "Best",
              "2"
            ]
          ]
        ],
        [
          "After visiting 20, push 7 and 15 at depth 3.",
          [
            [
              "Nodes",
              "+3 +9 +20 *15 7"
            ],
            [
              "Stack",
              "7@3 15@3"
            ],
            [
              "Best",
              "2"
            ]
          ]
        ],
        [
          "Visit both depth-3 leaves. The stack is empty.",
          [
            [
              "Nodes",
              "+3 +9 +20 +15 +7"
            ],
            [
              "Stack",
              "∅"
            ],
            [
              "Best",
              "+3"
            ]
          ]
        ]
      ],
      "idea": "Depth-first search explores a branch before its siblings. A subtree's maximum depth is one plus the greater child depth. The empty subtree has depth zero. Preorder visits before children, inorder between children, and postorder after both.",
      "pitfall": "Depth here counts nodes on the path, so one node has depth 1. TreeNode is provided by LeetCode. A binary tree has at most two children per node.",
      "warmup": "Represent each node as (value, left, right) and an empty subtree as None. Return the inorder list of values using an accumulator.",
      "warm": "def inorder(root):\n    result = []\n    def visit(node):\n        if node is None:\n            return\n        value, left, right = node\n        visit(left)\n        result.append(value)\n        visit(right)\n    visit(root)\n    return result",
      "lc": "Return the number of nodes on the longest path from the root to a leaf.",
      "hint": "Put (root, 1) on a stack. Each child starts one level deeper than its parent.",
      "why": "Every reachable node is visited with its true depth, since the child's depth is the parent's depth plus one. The maximum visited depth is the depth of a deepest leaf.",
      "solution": "class Solution:\n    def maxDepth(self, root):\n        if root is None:\n            return 0\n        stack = [(root, 1)]\n        best = 0\n        while stack:\n            node, depth = stack.pop()\n            best = max(best, depth)\n            if node.right is not None:\n                stack.append((node.right, depth + 1))\n            if node.left is not None:\n                stack.append((node.left, depth + 1))\n        return best",
      "steps": [
        "Define exactly what a call returns for an empty tree and for a leaf.",
        "Get the depth of each child before computing the parent's answer.",
        "Use an explicit stack on potentially very deep inputs. A skewed tree can exceed Python's recursion limit."
      ],
      "cost": [
        [
          "Recursive postorder",
          "O(n)",
          "O(h) call stack",
          "h is tree height. The recurrence is direct."
        ],
        [
          "Iterative DFS",
          "O(n)",
          "O(h) extra",
          "Carry the depth on the stack and track its maximum. It avoids Python recursion limits."
        ]
      ],
      "graph": [
        [
          "3,50,12",
          "9,23,46",
          "20,73,46",
          "15,57,83",
          "7,88,83"
        ],
        [
          "3-9",
          "3-20",
          "20-15",
          "20-7"
        ]
      ],
      "recognize": "Use DFS when the result depends on completing a branch or aggregating subtrees, such as depth, path sum, or a subtree property.",
      "checkpoint": [
        "How does height affect the memory of recursive DFS?",
        "Calls remain active along the current branch. A balanced binary tree has logarithmic height, while a skewed tree can need O(n) frames."
      ]
    },
    {
      "title": "Binary tree BFS",
      "slug": "binary-tree-level-order-traversal",
      "number": 102,
      "problem": "Binary Tree Level Order Traversal",
      "difficulty": "Medium",
      "category": "Data structure",
      "examples": [
        [
          "level_widths({'A': ['B', 'C'], 'B': ['D']}, 'A')",
          "[1, 2, 1]"
        ],
        [
          "level_widths({}, None)",
          "[]"
        ]
      ],
      "frames": [
        [
          "Queue only the root to start.",
          [
            [
              "Nodes",
              "*3 9 20 15 7"
            ],
            [
              "Queue",
              "3"
            ],
            [
              "Levels",
              "∅"
            ]
          ]
        ],
        [
          "Read one node at depth 0. Queue its children.",
          [
            [
              "Nodes",
              "+3 *9 *20 15 7"
            ],
            [
              "Queue",
              "9 20"
            ],
            [
              "Levels",
              "+[3]"
            ]
          ]
        ],
        [
          "Read exactly two nodes at depth 1. Queue the children of 20.",
          [
            [
              "Nodes",
              "+3 +9 +20 *15 *7"
            ],
            [
              "Queue",
              "15 7"
            ],
            [
              "Levels",
              "[3] +[9,20]"
            ]
          ]
        ],
        [
          "Read the two leaves. The queue is empty.",
          [
            [
              "Nodes",
              "+3 +9 +20 +15 +7"
            ],
            [
              "Queue",
              "∅"
            ],
            [
              "Levels",
              "[3] [9,20] +[15,7]"
            ]
          ]
        ]
      ],
      "idea": "Breadth-first search visits nodes by distance from the root. A FIFO queue keeps shallower nodes before deeper ones. Capture the queue length at the start of each level.",
      "pitfall": "Read the level size before processing any children. Rechecking a changing queue length can mix levels. Use deque.popleft() for an O(1) front removal.",
      "warmup": "Given a dictionary from parent labels to ordered child labels for a tree, return the number of nodes at each level from the root. A missing dictionary entry means no children.",
      "warm": "from collections import deque\n\ndef level_widths(children, root):\n    queue = deque([] if root is None else [root])\n    widths = []\n    while queue:\n        width = len(queue)\n        widths.append(width)\n        for _ in range(width):\n            queue.extend(children.get(queue.popleft(), []))\n    return widths",
      "lc": "Return node values grouped by depth, from left to right within each group.",
      "hint": "Freeze the queue length when a new level starts.",
      "why": "When each outer iteration starts, the queue contains exactly one level. Its children are appended left to right and wait behind the current nodes, preserving level and within-level order.",
      "solution": "from collections import deque\n\nclass Solution:\n    def levelOrder(self, root):\n        if root is None:\n            return []\n        queue = deque([root])\n        result = []\n        while queue:\n            level = []\n            for _ in range(len(queue)):\n                node = queue.popleft()\n                level.append(node.val)\n                if node.left is not None:\n                    queue.append(node.left)\n                if node.right is not None:\n                    queue.append(node.right)\n            result.append(level)\n        return result",
      "steps": [
        "Enqueue the root if it exists.",
        "At each level, dequeue exactly the number of nodes currently queued.",
        "Collect their values and enqueue their children. Those children form the following level."
      ],
      "cost": [
        [
          "Rescan the tree for each depth",
          "O(nh) upper bound",
          "O(h) call stack",
          "Repeated scans can be quadratic on a chain. h is height."
        ],
        [
          "Process one queue per traversal",
          "O(n)",
          "O(w) extra beyond output",
          "w is maximum level width. The queue holds portions of at most two adjacent levels."
        ]
      ],
      "graph": [
        [
          "3,50,12",
          "9,23,46",
          "20,73,46",
          "15,57,83",
          "7,88,83"
        ],
        [
          "3-9",
          "3-20",
          "20-15",
          "20-7"
        ]
      ],
      "recognize": "Use BFS when you need levels, shortest hop counts, or nodes in order of increasing distance.",
      "checkpoint": [
        "Why is it unsafe to loop until the queue is empty while building just one level?",
        "Each parent can add children to the queue. Processing until empty would consume descendants in the same group. The initial size isolates the current level."
      ]
    },
    {
      "title": "Binary search trees",
      "slug": "validate-binary-search-tree",
      "number": 98,
      "problem": "Validate Binary Search Tree",
      "difficulty": "Medium",
      "category": "Data structure",
      "examples": [
        [
          "bst_contains((8, (3, None, None), (10, None, None)), 10)",
          "True"
        ],
        [
          "bst_contains((8, (3, None, None), None), 10)",
          "False"
        ]
      ],
      "frames": [
        [
          "Local checks pass, but the right subtree of 5 contains 4.",
          [
            [
              "Nodes",
              "5 1 7 4 8"
            ],
            [
              "Inorder",
              "∅"
            ]
          ]
        ],
        [
          "Descend left and visit 1 first.",
          [
            [
              "Nodes",
              "5 *1 7 4 8"
            ],
            [
              "Inorder",
              "+1"
            ]
          ]
        ],
        [
          "Pop the root and visit 5 next.",
          [
            [
              "Nodes",
              "*5 +1 7 4 8"
            ],
            [
              "Inorder",
              "+1 +5"
            ]
          ]
        ],
        [
          "The next inorder value is 4. Since 4 ≤ 5, the tree is invalid.",
          [
            [
              "Nodes",
              "+5 +1 7 !4 8"
            ],
            [
              "Inorder",
              "1 5 !4"
            ],
            [
              "Result",
              "!invalid"
            ]
          ]
        ]
      ],
      "idea": "In a strict binary search tree, every value in a left subtree is smaller than its ancestor and every value in a right subtree is larger. Inorder traversal of a valid BST yields a strictly increasing sequence.",
      "pitfall": "Checking direct children is insufficient. A node can be smaller than its parent but still violate a lower bound from an ancestor. Duplicate keys are invalid here.",
      "warmup": "Look up a target in a BST represented as (value, left, right) tuples. Return whether the target exists.",
      "warm": "def bst_contains(node, target):\n    while node is not None:\n        value, left, right = node\n        if target == value:\n            return True\n        node = left if target < value else right\n    return False",
      "lc": "Check whether the entire binary tree obeys the strict BST ordering rule.",
      "hint": "A sorted inorder sequence provides a global check. Alternatively, propagate both bounds from ancestors.",
      "why": "Every node's left-subtree values precede it in inorder and every right-subtree value follows it. Strictly increasing order guarantees both global constraints for every node.",
      "solution": "class Solution:\n    def isValidBST(self, root):\n        stack = []\n        current = root\n        previous = None\n        while stack or current is not None:\n            while current is not None:\n                stack.append(current)\n                current = current.left\n            current = stack.pop()\n            if previous is not None and current.val <= previous:\n                return False\n            previous = current.val\n            current = current.right\n        return True",
      "steps": [
        "Descend left, saving ancestors on a stack.",
        "When you pop a node, compare its value to the previous inorder value.",
        "Then descend its right subtree. A non-increasing pair proves the BST is invalid."
      ],
      "cost": [
        [
          "Rescan each node's subtrees",
          "O(nh) upper bound",
          "O(h) call stack",
          "Repeated min/max scans can be quadratic for a skewed tree."
        ],
        [
          "Validate in one inorder pass",
          "O(n)",
          "O(h) extra",
          "Keep a traversal stack and one previous value."
        ]
      ],
      "graph": [
        [
          "5,50,12",
          "1,22,46",
          "7,73,46",
          "4,57,83",
          "8,88,83"
        ],
        [
          "5-1",
          "5-7",
          "7-4",
          "7-8"
        ]
      ],
      "recognize": "Use a BST when the ordering invariant lets you eliminate an entire subtree. Balance determines whether search stays logarithmic.",
      "checkpoint": [
        "Why can direct-child checks pass for root 5 with right child 7 and grandchild 4 under 7?",
        "4 is below 7, so it passes that local check. It sits in the right subtree of 5 and violates the lower bound inherited from 5."
      ]
    },
    {
      "title": "Heaps and priority queues",
      "slug": "kth-largest-element-in-an-array",
      "number": 215,
      "problem": "Kth Largest Element in an Array",
      "difficulty": "Medium",
      "category": "Data structure",
      "examples": [
        [
          "dispatch([(2, 'B'), (1, 'Z'), (1, 'A')])",
          "['A', 'Z', 'B']"
        ],
        [
          "dispatch([])",
          "[]"
        ]
      ],
      "frames": [
        [
          "Find the second largest entry. Start with an empty min-heap.",
          [
            [
              "Input",
              "4 1 7 3"
            ],
            [
              "Heap array",
              "∅"
            ],
            [
              "k",
              "2"
            ]
          ]
        ],
        [
          "Read 4, then 1. The root is 1.",
          [
            [
              "Input",
              "+4 *1 7 3"
            ],
            [
              "Heap array",
              "+1 4"
            ]
          ]
        ],
        [
          "Read 7. Remove 1 to keep only two entries.",
          [
            [
              "Input",
              "4 !1 *7 3"
            ],
            [
              "Heap array",
              "+4 7"
            ]
          ]
        ],
        [
          "Read 3. It is pushed and immediately removed as the smallest.",
          [
            [
              "Input",
              "4 !1 7 !3"
            ],
            [
              "Heap array",
              "+4 7"
            ],
            [
              "Answer",
              "+4"
            ]
          ]
        ]
      ],
      "idea": "A min-heap exposes its smallest item at the root. Keep a min-heap of the largest k values seen so far. Its smallest retained value is the kth largest overall.",
      "pitfall": "A heap guarantees parent-child order, not sorted iteration. A min-heap is appropriate here because the weakest retained value is the one to discard.",
      "warmup": "Process (priority, job_name) tuples from lowest priority number to highest, breaking ties alphabetically by job_name. Build the initial heap with heapify.",
      "warm": "import heapq\n\ndef dispatch(jobs):\n    heap = list(jobs)\n    heapq.heapify(heap)\n    return [heapq.heappop(heap)[1] for _ in range(len(heap))]",
      "lc": "Return the kth largest array entry in sorted order, counting duplicates. Use a heap-based approach.",
      "hint": "Which element should leave when you have k + 1 candidates for the largest k?",
      "why": "After each update the heap contains the min(k, number seen) largest entries processed so far. Popping the smallest when full preserves that invariant. The root is the kth largest at the end.",
      "solution": "import heapq\n\nclass Solution:\n    def findKthLargest(self, nums, k):\n        heap = []\n        for value in nums:\n            heapq.heappush(heap, value)\n            if len(heap) > k:\n                heapq.heappop(heap)\n        return heap[0]",
      "steps": [
        "Push each new value into the min-heap.",
        "If the size exceeds k, pop the smallest value.",
        "After reading all n items, return the root. Duplicates occupy separate positions."
      ],
      "cost": [
        [
          "Sort all values",
          "O(n log n)",
          "O(n) for Python sorted()",
          "Read position n − k from the sorted result."
        ],
        [
          "Maintain the top k values",
          "O(n log(k + 1))",
          "O(k) extra",
          "Python heapq provides O(log(k + 1)) pushes and pops and O(1) root access."
        ]
      ],
      "recognize": "Use a heap when you repeatedly need an extreme value, or when maintaining the best k items from a stream.",
      "checkpoint": [
        "Why does a min-heap help when you want the largest items?",
        "The root is the least of the k retained values, so it is the first candidate to evict. When k is small, updates cost much less than re-sorting all items."
      ]
    },
    {
      "title": "Tries",
      "slug": "implement-trie-prefix-tree",
      "number": 208,
      "problem": "Implement Trie (Prefix Tree)",
      "difficulty": "Medium",
      "category": "Data structure",
      "examples": [
        [
          "has_prefix(['car', 'cat', 'dog'], 'ca')",
          "True"
        ],
        [
          "has_prefix(['car', 'cat'], 'cab')",
          "False"
        ],
        [
          "has_prefix([], '')",
          "True"
        ]
      ],
      "frames": [
        [
          "Insert “car” by creating edges c, a, and r. The faded branch is still absent.",
          [
            [
              "Nodes",
              "∅ *c *ca +car !cat"
            ],
            [
              "Terminal words",
              "+car"
            ]
          ]
        ],
        [
          "Insert “cat”. Reuse c and a, then add a branch for t.",
          [
            [
              "Nodes",
              "∅ +c +ca +car *cat"
            ],
            [
              "Terminal words",
              "+car +cat"
            ]
          ]
        ],
        [
          "Walk c then a. The path exists, so startsWith('ca') succeeds.",
          [
            [
              "Nodes",
              "∅ +c *ca car cat"
            ],
            [
              "Query",
              "+c +a"
            ],
            [
              "Prefix exists",
              "+True"
            ]
          ]
        ],
        [
          "No terminal marker is stored at “ca”, so exact search fails.",
          [
            [
              "Nodes",
              "∅ c *ca car cat"
            ],
            [
              "Exact word",
              "!False"
            ]
          ]
        ]
      ],
      "idea": "A trie shares prefixes between words. Each edge consumes one character. A terminal marker distinguishes a complete word from a prefix of a longer word.",
      "pitfall": "A path can exist even when the word was never inserted. In a Python dictionary implementation, use a marker outside the permitted character alphabet.",
      "warmup": "Build a trie for a list of lowercase words. Given a prefix, return whether that path exists. For an empty prefix return True.",
      "warm": "def has_prefix(words, prefix):\n    root = {}\n    for word in words:\n        node = root\n        for char in word:\n            node = node.setdefault(char, {})\n    node = root\n    for char in prefix:\n        if char not in node:\n            return False\n        node = node[char]\n    return True",
      "lc": "Implement insertion, exact word search, and prefix search in a trie.",
      "hint": "Put a terminal flag at the node where a full word ends.",
      "why": "Each path from the root uniquely represents its character sequence. Insertion marks precisely the terminal nodes of inserted words. Prefix search checks the path, while exact search also checks that mark.",
      "solution": "class Trie:\n    def __init__(self):\n        self.root = {}\n\n    def insert(self, word):\n        node = self.root\n        for char in word:\n            if char not in node:\n                node[char] = {}\n            node = node[char]\n        node[None] = True\n\n    def _walk(self, prefix):\n        node = self.root\n        for char in prefix:\n            if char not in node:\n                return None\n            node = node[char]\n        return node\n\n    def search(self, word):\n        node = self._walk(word)\n        return node is not None and None in node\n\n    def startsWith(self, prefix):\n        return self._walk(prefix) is not None",
      "steps": [
        "Insert by walking the characters, creating missing child nodes.",
        "To look up a path, stop as soon as a required child is absent.",
        "search requires a terminal node. startsWith only requires the path to exist."
      ],
      "cost": [
        [
          "Scan a list of words per query",
          "O(WL) worst case",
          "O(total characters) storage",
          "W is word count, and L is query length."
        ],
        [
          "Traverse the trie",
          "O(L) expected per operation",
          "O(total inserted characters) storage upper bound",
          "One dictionary lookup per character. Shared prefixes reuse nodes."
        ]
      ],
      "graph": [
        [
          "∅,11,49",
          "c,33,49",
          "ca,55,49",
          "car,81,24",
          "cat,81,75"
        ],
        [
          "∅-c",
          "c-ca",
          "ca-car",
          "ca-cat"
        ]
      ],
      "recognize": "Use a trie when many queries share leading characters or when you need to distinguish exact words from prefixes.",
      "checkpoint": [
        "What trade-off comes with using dictionaries at every trie node?",
        "Sparse dictionaries store only existing children and support expected constant-time character lookup. Each dictionary has overhead. A fixed alphabet array avoids hashing but can waste slots."
      ]
    },
    {
      "title": "Intervals",
      "slug": "merge-intervals",
      "number": 56,
      "problem": "Merge Intervals",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "merge_sorted([[1, 5], [2, 3], [5, 8], [10, 11]])",
          "[[1, 8], [10, 11]]"
        ],
        [
          "merge_sorted([])",
          "[]"
        ]
      ],
      "frames": [
        [
          "Sort intervals by start. Seed the result with [1, 5].",
          [
            [
              "Sorted intervals",
              "*[1,5] [2,3] [5,8] [10,11]"
            ],
            [
              "Merged",
              "+[1,5]"
            ]
          ]
        ],
        [
          "The next interval is contained in [1, 5]. Preserve end 5.",
          [
            [
              "Sorted intervals",
              "[1,5] *[2,3] [5,8] [10,11]"
            ],
            [
              "Merged",
              "+[1,5]"
            ]
          ]
        ],
        [
          "The next interval touches at 5. Extend the end to 8.",
          [
            [
              "Sorted intervals",
              "[1,5] [2,3] *[5,8] [10,11]"
            ],
            [
              "Merged",
              "+[1,8]"
            ]
          ]
        ],
        [
          "10 is greater than 8, so start a new interval.",
          [
            [
              "Sorted intervals",
              "[1,5] [2,3] [5,8] *[10,11]"
            ],
            [
              "Merged",
              "+[1,8] +[10,11]"
            ]
          ]
        ]
      ],
      "idea": "An interval covers a start through an end. Sort by start so that any new overlap can only extend the most recent merged interval. In this problem intervals are closed, so touching endpoints overlap.",
      "pitfall": "Use max(current_end, new_end), since the new interval may be nested entirely within the old one. Check whether your actual task uses closed or half-open endpoints.",
      "warmup": "Given intervals already sorted by start, return a fresh list of merged closed intervals. Preserve the original input.",
      "warm": "def merge_sorted(intervals):\n    result = []\n    for left, right in intervals:\n        if not result or left > result[-1][1]:\n            result.append([left, right])\n        else:\n            result[-1][1] = max(result[-1][1], right)\n    return result",
      "lc": "Merge a list of closed intervals and return the resulting disjoint intervals.",
      "hint": "Once sorted by start, compare the next interval only to the last interval you have merged.",
      "why": "A gap before a new start cannot be filled by any later interval because later starts are no smaller. Overlapping intervals can be replaced by their union without changing coverage.",
      "solution": "class Solution:\n    def merge(self, intervals):\n        result = []\n        for start, end in sorted(intervals):\n            if not result or start > result[-1][1]:\n                result.append([start, end])\n            else:\n                result[-1][1] = max(result[-1][1], end)\n        return result",
      "steps": [
        "Sort by start.",
        "If the next start exceeds the current merged end, begin a separate interval.",
        "Otherwise extend the merged end to the greater of the current and next ends."
      ],
      "cost": [
        [
          "Repeatedly scan for an overlapping pair",
          "O(n³) for full pair rescans",
          "O(n) working copy",
          "After each successful merge the number of intervals decreases by one."
        ],
        [
          "Sort, then scan once",
          "O(n log n)",
          "O(n) in Python",
          "The pass after sorting is O(n). Python sorting may allocate temporary storage."
        ]
      ],
      "recognize": "When many ranges overlap, sort by one endpoint and decide what invariant the scan should maintain.",
      "checkpoint": [
        "What would change if intervals were half-open and the task asked to merge only intersecting intervals?",
        "A next start equal to the previous end would share no point. Use start ≥ current end to begin a separate interval under that rule."
      ]
    },
    {
      "title": "Greedy reachability",
      "slug": "jump-game",
      "number": 55,
      "problem": "Jump Game",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "farthest_index([2, 0, 1, 0, 3])",
          "3"
        ],
        [
          "farthest_index([9, 0, 0])",
          "2"
        ]
      ],
      "frames": [
        [
          "Index 0 reaches indices 1 and 2.",
          [
            [
              "Jumps",
              "*2 +0 +1 0 3"
            ],
            [
              "Farthest",
              "+2"
            ]
          ]
        ],
        [
          "Index 1 adds no range.",
          [
            [
              "Jumps",
              "+2 *0 +1 0 3"
            ],
            [
              "Farthest",
              "2"
            ]
          ]
        ],
        [
          "Index 2 can reach index 3.",
          [
            [
              "Jumps",
              "+2 +0 *1 +0 3"
            ],
            [
              "Farthest",
              "+3"
            ]
          ]
        ],
        [
          "Index 3 allows no jump. Index 4 is beyond the frontier, so it cannot help.",
          [
            [
              "Jumps",
              "+2 +0 +1 *0 !3"
            ],
            [
              "Farthest",
              "+3"
            ],
            [
              "Result",
              "!False"
            ]
          ]
        ]
      ],
      "idea": "A greedy algorithm commits to a useful local choice and needs a proof that the choice preserves the answer. Here, jumps can be shorter than the allowed maximum, so the set of reachable positions is a contiguous prefix. Its farthest index is enough information.",
      "pitfall": "Only positions you can reach are allowed to extend the frontier. Greedy reasoning depends on the ability to choose any jump length up to the stated maximum.",
      "warmup": "Return the farthest reachable index within a nonempty array. Ignore jump destinations beyond the last index.",
      "warm": "def farthest_index(jumps):\n    farthest = 0\n    for index, jump in enumerate(jumps):\n        if index > farthest:\n            break\n        farthest = max(farthest, index + jump)\n    return min(farthest, len(jumps) - 1)",
      "lc": "From the first index, decide whether you can reach the last using the maximum jump lengths given at each position.",
      "hint": "Store the farthest reachable position, and test that the current index is reachable before using it.",
      "why": "All indices from 0 through farthest are reachable because jumps can stop anywhere within range. A reachable index can extend that prefix. Encountering a gap proves that no earlier reach covers it.",
      "solution": "class Solution:\n    def canJump(self, nums):\n        farthest = 0\n        for index, jump in enumerate(nums):\n            if index > farthest:\n                return False\n            farthest = max(farthest, index + jump)\n            if farthest >= len(nums) - 1:\n                return True\n        return False",
      "steps": [
        "Start with farthest = 0.",
        "Scan indices in order. If index > farthest, no reachable earlier position can cross this gap.",
        "Otherwise extend farthest with index + jump. Succeed once it covers the final index."
      ],
      "cost": [
        [
          "Try reachable jumps with DP",
          "O(n²) worst case",
          "O(n) extra",
          "For each reachable index, mark all destinations in bounds."
        ],
        [
          "Maintain the reach frontier",
          "O(n)",
          "O(1) extra",
          "Store just the right edge of the reachable prefix."
        ]
      ],
      "recognize": "Use a greedy summary when you can prove that retaining only the best current state is enough for future decisions.",
      "checkpoint": [
        "Would the same frontier prove reachability if you had to jump exactly the stated amount?",
        "No. Exact jumps can leave gaps within the frontier. The proof uses the freedom to stop at any intermediate distance."
      ]
    },
    {
      "title": "Graph traversal and flood fill",
      "slug": "number-of-islands",
      "number": 200,
      "problem": "Number of Islands",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "reachable({'A': ['B'], 'B': ['A', 'C'], 'D': []}, 'A')",
          "['A', 'B', 'C']"
        ],
        [
          "reachable({}, 'A')",
          "['A']"
        ]
      ],
      "frames": [
        [
          "Scan the grid. Only horizontal and vertical moves connect land cells.",
          [
            [
              "Row 0",
              "1 1 0"
            ],
            [
              "Row 1",
              "0 1 0"
            ],
            [
              "Row 2",
              "0 0 1"
            ],
            [
              "Islands",
              "0"
            ]
          ]
        ],
        [
          "Find land at (0, 0). Count an island and begin its fill.",
          [
            [
              "Row 0",
              "*1 1 0"
            ],
            [
              "Row 1",
              "0 1 0"
            ],
            [
              "Row 2",
              "0 0 1"
            ],
            [
              "Islands",
              "1"
            ]
          ]
        ],
        [
          "The fill reaches (0, 1) and (1, 1). Those three cells are now marked as water.",
          [
            [
              "Row 0",
              "+0 +0 0"
            ],
            [
              "Row 1",
              "0 +0 0"
            ],
            [
              "Row 2",
              "0 0 1"
            ],
            [
              "Islands",
              "1"
            ]
          ]
        ],
        [
          "The diagonal cell (2, 2) was unreachable. Count and fill a second island.",
          [
            [
              "Row 0",
              "+0 +0 0"
            ],
            [
              "Row 1",
              "0 +0 0"
            ],
            [
              "Row 2",
              "0 0 +0"
            ],
            [
              "Islands",
              "+2"
            ]
          ]
        ]
      ],
      "idea": "A graph consists of vertices and edges. A grid becomes a graph when cells are vertices and allowed neighbor moves are edges. Flood fill visits one connected component. An outer scan finds starting cells for components that have not yet been visited.",
      "pitfall": "Diagonal cells are not neighbors. Bounds-check before indexing. If you mutate the grid to mark visits, a second run on the same object sees a changed input.",
      "warmup": "Given a dictionary from each node to its neighbors, return a sorted list of nodes reachable from start. A missing adjacency entry means no outgoing edges.",
      "warm": "def reachable(graph, start):\n    seen, stack = {start}, [start]\n    while stack:\n        for neighbor in graph.get(stack.pop(), []):\n            if neighbor not in seen:\n                seen.add(neighbor)\n                stack.append(neighbor)\n    return sorted(seen)",
      "lc": "Count components of land cells connected horizontally or vertically in a grid of '1' and '0'.",
      "hint": "After counting the first land cell of an island, erase every land cell in that component.",
      "why": "The fill reaches every land cell connected to the seed and cannot cross water or a diagonal. Once filled, the whole component is marked, so the outer loop counts it exactly once.",
      "solution": "class Solution:\n    def numIslands(self, grid):\n        if not grid or not grid[0]:\n            return 0\n        rows, cols = len(grid), len(grid[0])\n        count = 0\n        for row in range(rows):\n            for col in range(cols):\n                if grid[row][col] != '1':\n                    continue\n                count += 1\n                grid[row][col] = '0'\n                stack = [(row, col)]\n                while stack:\n                    r, c = stack.pop()\n                    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n                        nr, nc = r + dr, c + dc\n                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':\n                            grid[nr][nc] = '0'\n                            stack.append((nr, nc))\n        return count",
      "steps": [
        "Scan every cell for unvisited land.",
        "Count one new island and run an iterative DFS through four-directional land neighbors.",
        "Mark a cell when adding it to the stack so it cannot be added twice."
      ],
      "cost": [
        [
          "DFS with a separate visited set",
          "O(rows × cols) expected",
          "O(rows × cols) extra worst case",
          "Preserves the input grid."
        ],
        [
          "DFS marking the grid in place",
          "O(rows × cols)",
          "O(rows × cols) stack worst case",
          "Removes the visited set, while pending DFS cells still require memory."
        ]
      ],
      "recognize": "Use graph traversal for reachability and components. Use a queue instead of a stack when you also need shortest distance in unweighted edges.",
      "checkpoint": [
        "Why mark a vertex when adding it to the queue or stack?",
        "Two earlier vertices may both point to it. Marking on insertion prevents duplicate pending work and makes each vertex enter once."
      ]
    },
    {
      "title": "Topological sorting",
      "slug": "course-schedule",
      "number": 207,
      "problem": "Course Schedule",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "order_courses(4, [(0, 2), (1, 2), (2, 3)])",
          "[0, 1, 2, 3]"
        ],
        [
          "order_courses(2, [(0, 1), (1, 0)])",
          "[]"
        ]
      ],
      "frames": [
        [
          "A and B have no prerequisites and are ready.",
          [
            [
              "Nodes",
              "*A *B C D"
            ],
            [
              "Indegrees",
              "A=0 B=0 C=2 D=1"
            ],
            [
              "Ready",
              "A B"
            ]
          ]
        ],
        [
          "Complete A. C still depends on B.",
          [
            [
              "Nodes",
              "+A *B C D"
            ],
            [
              "Indegrees",
              "C=1 D=1"
            ],
            [
              "Ready",
              "B"
            ]
          ]
        ],
        [
          "Complete B. C now has zero remaining prerequisites.",
          [
            [
              "Nodes",
              "+A +B *C D"
            ],
            [
              "Indegrees",
              "C=0 D=1"
            ],
            [
              "Ready",
              "C"
            ]
          ]
        ],
        [
          "Complete C and then D. All courses can be finished.",
          [
            [
              "Nodes",
              "+A +B +C +D"
            ],
            [
              "Order",
              "+A +B +C +D"
            ]
          ]
        ]
      ],
      "idea": "A topological order places each prerequisite before its dependent. Kahn's algorithm repeatedly takes a node with indegree zero, meaning it has no remaining prerequisites. A directed cycle prevents a full ordering.",
      "pitfall": "A pair [course, prerequisite] describes an edge from prerequisite to course. Include isolated nodes and initialize their indegrees to zero.",
      "warmup": "Return one valid course ordering using pairs (before, after). Seed the initial FIFO queue in numerical order and visit outgoing edges in the input order. Return [] if a cycle blocks completion.",
      "warm": "from collections import deque\n\ndef order_courses(n, edges):\n    outgoing = [[] for _ in range(n)]\n    indegree = [0] * n\n    for before, after in edges:\n        outgoing[before].append(after)\n        indegree[after] += 1\n    ready = deque(i for i in range(n) if indegree[i] == 0)\n    order = []\n    while ready:\n        node = ready.popleft()\n        order.append(node)\n        for after in outgoing[node]:\n            indegree[after] -= 1\n            if indegree[after] == 0:\n                ready.append(after)\n    return order if len(order) == n else []",
      "lc": "Given course prerequisites, decide whether all courses can be completed.",
      "hint": "What does it mean if unfinished courses remain and none has zero indegree?",
      "why": "A zero-indegree course can legally be taken next. If nodes remain with positive indegree, following their unresolved prerequisites in a finite graph must reach a cycle.",
      "solution": "from collections import deque\n\nclass Solution:\n    def canFinish(self, numCourses, prerequisites):\n        outgoing = [[] for _ in range(numCourses)]\n        indegree = [0] * numCourses\n        for course, prerequisite in prerequisites:\n            outgoing[prerequisite].append(course)\n            indegree[course] += 1\n        ready = deque(i for i in range(numCourses) if indegree[i] == 0)\n        completed = 0\n        while ready:\n            course = ready.popleft()\n            completed += 1\n            for following in outgoing[course]:\n                indegree[following] -= 1\n                if indegree[following] == 0:\n                    ready.append(following)\n        return completed == numCourses",
      "steps": [
        "Build edges from prerequisite to dependent and count each dependent's indegree.",
        "Enqueue all nodes with zero indegree.",
        "Remove them one by one and reduce indegrees of their dependents. The graph is acyclic if every node is removed."
      ],
      "cost": [
        [
          "Rescan remaining nodes and edges for each removal",
          "O(V(V + E)) upper bound",
          "O(V + E)",
          "A straightforward method repeatedly rebuilds the available set."
        ],
        [
          "Kahn's algorithm",
          "O(V + E)",
          "O(V + E)",
          "Build adjacency lists and process each node and edge at most once."
        ]
      ],
      "graph": [
        [
          "A,22,20",
          "B,22,78",
          "C,55,49",
          "D,82,49"
        ],
        [
          "A>C",
          "B>C",
          "C>D"
        ]
      ],
      "recognize": "Use topological sorting for dependencies and scheduling. A prerequisite relation must be directed.",
      "checkpoint": [
        "What remains after the zero-indegree queue empties on a graph that has a cycle?",
        "Every remaining node still has a remaining predecessor. Following predecessors must eventually repeat a node, so at least one cycle prevents completion."
      ]
    },
    {
      "title": "Union-find",
      "slug": "redundant-connection",
      "number": 684,
      "problem": "Redundant Connection",
      "difficulty": "Medium",
      "category": "Data structure",
      "examples": [
        [
          "components(5, [(0, 1), (1, 2), (0, 2), (3, 4)])",
          "2"
        ],
        [
          "components(3, [])",
          "3"
        ]
      ],
      "frames": [
        [
          "Start with three separate roots.",
          [
            [
              "Parents of 1, 2, 3",
              "1 2 3"
            ],
            [
              "Edges",
              "1–2 1–3 2–3"
            ]
          ]
        ],
        [
          "Process 1–2. Attach root 2 to root 1.",
          [
            [
              "Parents of 1, 2, 3",
              "+1 *1 3"
            ],
            [
              "Edges",
              "+1–2 1–3 2–3"
            ]
          ]
        ],
        [
          "Process 1–3. Attach root 3 to the larger group.",
          [
            [
              "Parents of 1, 2, 3",
              "+1 +1 *1"
            ],
            [
              "Edges",
              "+1–2 +1–3 2–3"
            ]
          ]
        ],
        [
          "Roots of 2 and 3 are both 1. Edge 2–3 closes the cycle.",
          [
            [
              "Parents of 1, 2, 3",
              "+1 +1 +1"
            ],
            [
              "Edges",
              "+1–2 +1–3 !2–3"
            ],
            [
              "Answer",
              "+[2,3]"
            ]
          ]
        ]
      ],
      "idea": "Union-find tracks disjoint groups. find returns a representative root and union merges two groups. Path compression shortens future searches. Union by size attaches the smaller tree under the larger root.",
      "pitfall": "Join roots, not arbitrary endpoints. This detects cycles in undirected graphs. For directed cycles use a directed method such as topological sorting.",
      "warmup": "Given n nodes labeled 0 through n−1 and a sequence of edges, return the number of connected components after adding all edges.",
      "warm": "def components(n, edges):\n    parent = list(range(n))\n    size = [1] * n\n\n    def find(node):\n        while node != parent[node]:\n            parent[node] = parent[parent[node]]\n            node = parent[node]\n        return node\n\n    count = n\n    for a, b in edges:\n        x, y = find(a), find(b)\n        if x != y:\n            if size[x] < size[y]:\n                x, y = y, x\n            parent[y] = x\n            size[x] += size[y]\n            count -= 1\n    return count",
      "lc": "A tree received one extra undirected edge. Return the last edge in input order that can be removed to restore a tree.",
      "hint": "The first failed union identifies the edge that completes the cycle.",
      "why": "A union fails when earlier edges already link both endpoints. With exactly one extra edge, there is one cycle. The last input edge on that cycle is the one that closes it during the scan.",
      "solution": "class Solution:\n    def findRedundantConnection(self, edges):\n        n = len(edges)\n        parent = list(range(n + 1))\n        size = [1] * (n + 1)\n\n        def find(x):\n            while x != parent[x]:\n                parent[x] = parent[parent[x]]\n                x = parent[x]\n            return x\n\n        for a, b in edges:\n            x, y = find(a), find(b)\n            if x == y:\n                return [a, b]\n            if size[x] < size[y]:\n                x, y = y, x\n            parent[y] = x\n            size[x] += size[y]",
      "steps": [
        "Initialize each vertex as a group of size one.",
        "For each edge, find both roots. If they match, that edge closes a cycle.",
        "Otherwise connect the roots by size, updating the size of the surviving root."
      ],
      "cost": [
        [
          "Run a fresh path search per edge",
          "O(E(V + E)) upper bound",
          "O(V + E)",
          "An undirected edge forms a cycle if its endpoints were already connected."
        ],
        [
          "Use path compression and union by size",
          "O(V + E α(V)) amortized total",
          "O(V)",
          "α is the inverse Ackermann function and grows extremely slowly."
        ]
      ],
      "recognize": "Use union-find when undirected connections are added and you repeatedly need to check membership in the same component.",
      "checkpoint": [
        "Why does path compression preserve group membership?",
        "It changes a node's link to an ancestor in the same tree. The representative root stays the same, and later find operations follow fewer links."
      ]
    },
    {
      "title": "Weighted shortest paths",
      "slug": "network-delay-time",
      "number": 743,
      "problem": "Network Delay Time",
      "difficulty": "Medium",
      "category": "Advanced",
      "examples": [
        [
          "relax_distances(4, [(0, 1, 5), (0, 2, 1), (2, 1, 1)], 0)",
          "[0, 2, 1, None]"
        ],
        [
          "relax_distances(1, [], 0)",
          "[0]"
        ]
      ],
      "frames": [
        [
          "Start the signal at vertex 1.",
          [
            [
              "Nodes",
              "*1 2 3"
            ],
            [
              "Distances",
              "0 ∞ ∞"
            ],
            [
              "Heap",
              "(0,1)"
            ]
          ]
        ],
        [
          "Pop 1. Reach 2 in 5 and 3 in 1.",
          [
            [
              "Nodes",
              "+1 2 *3"
            ],
            [
              "Distances",
              "+0 5 1"
            ],
            [
              "Heap",
              "(1,3) (5,2)"
            ]
          ]
        ],
        [
          "Pop 3. Improve the route to 2 from 5 to 2.",
          [
            [
              "Nodes",
              "+1 *2 +3"
            ],
            [
              "Distances",
              "+0 *2 +1"
            ],
            [
              "Heap",
              "(2,2) (5,2)"
            ]
          ]
        ],
        [
          "Pop 2 at cost 2. The old cost 5 is stale. Maximum final distance is 2.",
          [
            [
              "Nodes",
              "+1 +2 +3"
            ],
            [
              "Distances",
              "+0 +2 +1"
            ],
            [
              "Delay",
              "+2"
            ]
          ]
        ]
      ],
      "idea": "Dijkstra's algorithm settles nodes in increasing tentative distance. With nonnegative edge weights, a later detour cannot improve the current closest unsettled node. A min-heap implements that choice.",
      "pitfall": "BFS finds shortest paths when edges have equal cost. For negative edge weights, use an appropriate alternative such as Bellman–Ford.",
      "warmup": "Given directed positive-weight edges (u, v, w) for vertices 0 through n−1, return distances from the source by repeated edge relaxation. Return None for unreachable nodes.",
      "warm": "def relax_distances(n, edges, source):\n    dist = [float('inf')] * n\n    dist[source] = 0\n    for _ in range(n - 1):\n        changed = False\n        for u, v, weight in edges:\n            if dist[u] + weight < dist[v]:\n                dist[v] = dist[u] + weight\n                changed = True\n        if not changed:\n            break\n    return [None if d == float('inf') else d for d in dist]",
      "lc": "Send a signal from one vertex through directed weighted edges. Return the time for all vertices to receive it, or −1 if any cannot.",
      "hint": "The time all nodes have received the signal is the largest shortest-path distance.",
      "why": "The closest current heap entry gives a final distance because every extension of a path adds nonnegative weight. Relaxations propagate shortest distances, and infinite distances identify unreachable vertices.",
      "solution": "import heapq\n\nclass Solution:\n    def networkDelayTime(self, times, n, k):\n        outgoing = [[] for _ in range(n + 1)]\n        for u, v, weight in times:\n            outgoing[u].append((v, weight))\n        dist = [float('inf')] * (n + 1)\n        dist[k] = 0\n        heap = [(0, k)]\n        while heap:\n            cost, u = heapq.heappop(heap)\n            if cost != dist[u]:\n                continue\n            for v, weight in outgoing[u]:\n                candidate = cost + weight\n                if candidate < dist[v]:\n                    dist[v] = candidate\n                    heapq.heappush(heap, (candidate, v))\n        answer = max(dist[1:])\n        return -1 if answer == float('inf') else answer",
      "steps": [
        "Initialize the source distance to zero and all other distances to infinity.",
        "Pop the least tentative distance. Skip stale entries whose distances were improved after insertion.",
        "Relax each outgoing edge: update and push when going through the current node gives a shorter path."
      ],
      "cost": [
        [
          "Select the closest node by scanning all nodes",
          "O(V² + E)",
          "O(V + E)",
          "A reasonable baseline on dense graphs."
        ],
        [
          "Dijkstra with a lazy min-heap",
          "O((V + E) log(V + E))",
          "O(V + E)",
          "Repeated improvements can leave up to O(E) heap entries. Weights must be nonnegative."
        ]
      ],
      "graph": [
        [
          "1,18,25",
          "2,82,25",
          "3,50,77"
        ],
        [
          "1>2:5",
          "1>3:1",
          "3>2:1"
        ]
      ],
      "recognize": "Use Dijkstra for nonnegative weighted distances. Use BFS for equal edge costs or repeated relaxation when negative edges are allowed and the graph has no reachable negative cycle.",
      "checkpoint": [
        "What happens when the heap contains both a cost of 2 and an old cost of 5 for the same vertex?",
        "The cost-2 entry settles the vertex first. When the cost-5 entry is popped, it differs from the recorded distance and is skipped."
      ]
    },
    {
      "title": "Minimum spanning trees",
      "slug": "min-cost-to-connect-all-points",
      "number": 1584,
      "problem": "Min Cost to Connect All Points",
      "difficulty": "Medium",
      "category": "Advanced",
      "examples": [
        [
          "nearest([(0, 0), (2, 1), (1, 1)], 0)",
          "2"
        ],
        [
          "nearest([(0, 0), (1, 0), (0, 1)], 0)",
          "1"
        ],
        [
          "nearest([(4, 2)], 0)",
          "None"
        ]
      ],
      "frames": [
        [
          "Use points A=(0,0), B=(2,0), C=(5,0). Start with A at cost 0.",
          [
            [
              "Nodes",
              "*A B C"
            ],
            [
              "Best attachment",
              "0 ∞ ∞"
            ],
            [
              "Total",
              "0"
            ]
          ]
        ],
        [
          "From A, B costs 2 and C costs 5.",
          [
            [
              "Nodes",
              "+A *B C"
            ],
            [
              "Best attachment",
              "· 2 5"
            ],
            [
              "Total",
              "0"
            ]
          ]
        ],
        [
          "Add B for 2. From B, C can now attach for 3.",
          [
            [
              "Nodes",
              "+A +B *C"
            ],
            [
              "Best attachment",
              "· · 3"
            ],
            [
              "Total",
              "2"
            ]
          ]
        ],
        [
          "Add C for 3. Two edges connect all three points for total 5.",
          [
            [
              "Nodes",
              "+A +B +C"
            ],
            [
              "Chosen edges",
              "+A–B +B–C"
            ],
            [
              "Total",
              "+5"
            ]
          ]
        ]
      ],
      "idea": "A minimum spanning tree connects all vertices with minimum total edge cost. Prim's algorithm grows a connected set by adding its cheapest edge to any outside vertex. This minimizes network cost, while Dijkstra minimizes distances from one source.",
      "pitfall": "Prim updates with the direct edge cost. Adding the current node's total distance would change the rule to shortest-path relaxation.",
      "warmup": "Given nonempty distinct points and a starting index, return the index of the closest other point by Manhattan distance, breaking ties by lower index. Return None for a one-point input.",
      "warm": "def nearest(points, start):\n    x, y = points[start]\n    candidates = (i for i in range(len(points)) if i != start)\n    return min(candidates, default=None,\n               key=lambda i: abs(points[i][0] - x) + abs(points[i][1] - y))",
      "lc": "Connect all points at minimum total cost. The cost between two points is their Manhattan distance.",
      "hint": "Every step needs only the cheapest connection from the current tree to each unused point.",
      "why": "The lightest edge crossing the cut between the tree and the unused points is safe by the cut property. If a minimum tree omits it, adding it creates a cycle with another cut edge that can be replaced without increasing cost.",
      "solution": "class Solution:\n    def minCostConnectPoints(self, points):\n        n = len(points)\n        used = [False] * n\n        best = [float('inf')] * n\n        best[0] = 0\n        total = 0\n        for _ in range(n):\n            node = -1\n            for i in range(n):\n                if not used[i] and (node == -1 or best[i] < best[node]):\n                    node = i\n            used[node] = True\n            total += best[node]\n            x, y = points[node]\n            for i, (a, b) in enumerate(points):\n                if not used[i]:\n                    best[i] = min(best[i], abs(a - x) + abs(b - y))\n        return total",
      "steps": [
        "Start with any vertex at attachment cost zero.",
        "Among unused vertices, pick the one with the smallest attachment cost.",
        "Add that cost and update every remaining vertex with the cost of connecting directly to the new vertex."
      ],
      "cost": [
        [
          "Materialize and sort all edges for Kruskal",
          "O(n² log n)",
          "O(n²) extra",
          "A complete graph contains n(n−1)/2 edges."
        ],
        [
          "Dense Prim with implicit distances",
          "O(n²)",
          "O(n) extra",
          "Compute a Manhattan edge cost only when needed and store one best cost per vertex."
        ]
      ],
      "graph": [
        [
          "A,18,48",
          "B,50,19",
          "C,82,48"
        ],
        [
          "A-B:2",
          "A-C:5",
          "B-C:3"
        ]
      ],
      "recognize": "Use a spanning tree when the goal is connecting a network cheaply. The path between two particular vertices need not be their shortest possible path.",
      "checkpoint": [
        "Why is an O(n²) scan attractive for points where every pair can connect?",
        "The complete graph already has quadratically many possible edges. Dense Prim checks those costs as needed and saves the edge list and sorting overhead."
      ]
    },
    {
      "title": "One-dimensional dynamic programming",
      "slug": "house-robber",
      "number": 198,
      "problem": "House Robber",
      "difficulty": "Medium",
      "category": "Core pattern",
      "examples": [
        [
          "climb_ways(4)",
          "5"
        ],
        [
          "climb_ways(0)",
          "1"
        ]
      ],
      "frames": [
        [
          "No houses means a total of zero.",
          [
            [
              "Houses",
              "2 7 9 3 1"
            ],
            [
              "Prefix best",
              "+0 · · · · ·"
            ]
          ]
        ],
        [
          "At 2, taking the house gives 2.",
          [
            [
              "Houses",
              "*2 7 9 3 1"
            ],
            [
              "Prefix best",
              "0 +2 · · · ·"
            ]
          ]
        ],
        [
          "At 7, take 7 instead of keeping 2.",
          [
            [
              "Houses",
              "2 *7 9 3 1"
            ],
            [
              "Prefix best",
              "0 2 +7 · · ·"
            ]
          ]
        ],
        [
          "At 9, take it with the first house: 2 + 9 = 11.",
          [
            [
              "Houses",
              "2 7 *9 3 1"
            ],
            [
              "Prefix best",
              "0 2 7 +11 · ·"
            ]
          ]
        ],
        [
          "At 3, skipping preserves 11 because taking gives 7 + 3 = 10.",
          [
            [
              "Houses",
              "2 7 9 *3 1"
            ],
            [
              "Prefix best",
              "0 2 7 11 +11 ·"
            ]
          ]
        ],
        [
          "At 1, taking gives 11 + 1 = 12.",
          [
            [
              "Houses",
              "2 7 9 3 *1"
            ],
            [
              "Prefix best",
              "0 2 7 11 11 +12"
            ]
          ]
        ]
      ],
      "idea": "Dynamic programming stores solutions to overlapping subproblems. Define best[i] as the maximum money from the first i houses. At the last house of that prefix, either skip it or take it and give up its immediate neighbor.",
      "pitfall": "Take uses the result two positions back. Update the two variables together so both transition inputs come from the previous iteration.",
      "warmup": "Count the ways to climb n steps using steps of size 1 or 2. Treat staying at step zero as one way.",
      "warm": "def climb_ways(n):\n    if n < 2:\n        return 1\n    two_back = one_back = 1\n    for _ in range(2, n + 1):\n        two_back, one_back = one_back, one_back + two_back\n    return one_back",
      "lc": "Maximize the total amount taken from a line of houses without taking from adjacent houses.",
      "hint": "Write down the best total for each prefix. Split cases according to whether you take its last house.",
      "why": "Every optimal plan either skips the latest house or includes it, in which case the previous house is forbidden. The transition considers both options and uses optimal solutions to their smaller prefixes.",
      "solution": "class Solution:\n    def rob(self, nums):\n        two_back = one_back = 0\n        for amount in nums:\n            two_back, one_back = one_back, max(one_back, two_back + amount)\n        return one_back",
      "steps": [
        "Use best[0] = 0 and best[1] = value of the first house for nonnegative amounts.",
        "Compute best[i] = max(best[i−1], best[i−2] + value[i−1]).",
        "Keep only the two previous states when the task asks for the value rather than the chosen houses."
      ],
      "cost": [
        [
          "Recursive take-or-skip without caching",
          "O(2ⁿ) upper bound",
          "O(n) call stack",
          "Repeated calls solve the same prefixes."
        ],
        [
          "Bottom-up DP with two states",
          "O(n)",
          "O(1) extra",
          "A full table costs O(n) extra and helps reconstruct choices."
        ]
      ],
      "recognize": "Look for repeated take-or-skip decisions over prefixes. Memoization stores recursive results, while tabulation evaluates states in dependency order.",
      "checkpoint": [
        "If you also need the indices of the chosen houses, what extra information would you keep?",
        "Keep the prefix DP table or a decision record. Walk backward, compare the take and skip totals, and move back two positions when choosing a house."
      ]
    },
    {
      "title": "Two-dimensional dynamic programming",
      "slug": "longest-common-subsequence",
      "number": 1143,
      "problem": "Longest Common Subsequence",
      "difficulty": "Medium",
      "category": "Advanced",
      "examples": [
        [
          "grid_paths(2, 3)",
          "3"
        ],
        [
          "grid_paths(1, 4)",
          "1"
        ]
      ],
      "frames": [
        [
          "Compare “abc” and “ac”. Empty prefixes have answer zero.",
          [
            [
              "Columns",
              "∅ a c"
            ],
            [
              "∅",
              "0 0 0"
            ],
            [
              "a",
              "0 · ·"
            ],
            [
              "ab",
              "0 · ·"
            ],
            [
              "abc",
              "0 · ·"
            ]
          ]
        ],
        [
          "For prefix “a”, the first characters match. The second column keeps length 1.",
          [
            [
              "Columns",
              "∅ a c"
            ],
            [
              "∅",
              "0 0 0"
            ],
            [
              "a",
              "0 +1 +1"
            ],
            [
              "ab",
              "0 · ·"
            ],
            [
              "abc",
              "0 · ·"
            ]
          ]
        ],
        [
          "Neither column matches b. Both cells inherit length 1.",
          [
            [
              "Columns",
              "∅ a c"
            ],
            [
              "∅",
              "0 0 0"
            ],
            [
              "a",
              "0 1 1"
            ],
            [
              "ab",
              "0 +1 +1"
            ],
            [
              "abc",
              "0 · ·"
            ]
          ]
        ],
        [
          "The final c matches. Extend the diagonal length 1 to length 2.",
          [
            [
              "Columns",
              "∅ a c"
            ],
            [
              "∅",
              "0 0 0"
            ],
            [
              "a",
              "0 1 1"
            ],
            [
              "ab",
              "0 *1 1"
            ],
            [
              "abc",
              "0 1 +2"
            ]
          ]
        ]
      ],
      "idea": "When a subproblem depends on prefixes of two strings, use a state (i, j). In LCS, dp[i][j] is the longest common subsequence length of the first i and j characters. Subsequences keep order while allowing gaps.",
      "pitfall": "Keep the previous diagonal in a temporary variable. dp[j−1] already holds the current row. A substring requires contiguity and uses a different recurrence.",
      "warmup": "Count paths from the top-left to bottom-right of a positive rows-by-cols grid with only right and down moves. Use a 2D table.",
      "warm": "def grid_paths(rows, cols):\n    dp = [[1] * cols for _ in range(rows)]\n    for r in range(1, rows):\n        for c in range(1, cols):\n            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]\n    return dp[-1][-1]",
      "lc": "Return the length of the longest subsequence common to both strings.",
      "hint": "Write dp for two prefixes. Where do you get the answer when both final characters match?",
      "why": "If final characters match, an optimal answer can end with that match and extend an optimal solution for the shorter prefixes. If they differ, at least one final character is unused, so the better of the two smaller states suffices.",
      "solution": "class Solution:\n    def longestCommonSubsequence(self, text1, text2):\n        if len(text1) < len(text2):\n            text1, text2 = text2, text1\n        dp = [0] * (len(text2) + 1)\n        for a in text1:\n            diagonal = 0\n            for j, b in enumerate(text2, 1):\n                above = dp[j]\n                if a == b:\n                    dp[j] = diagonal + 1\n                else:\n                    dp[j] = max(above, dp[j - 1])\n                diagonal = above\n        return dp[-1]",
      "steps": [
        "Initialize the zero-length prefix states to zero.",
        "If the last characters match, use one plus the diagonal prefix answer.",
        "Otherwise take the maximum of dropping one last character from either string. Keep one previous row or update one row with a saved diagonal."
      ],
      "cost": [
        [
          "Fill a complete prefix table",
          "O(mn)",
          "O(mn) extra",
          "The table makes dependencies easy to see and can support reconstruction."
        ],
        [
          "Roll a single row",
          "O(mn)",
          "O(min(m,n)) extra",
          "Remember the overwritten diagonal while updating each cell."
        ]
      ],
      "recognize": "Use a 2D state when two independent indices determine the remaining subproblem, such as two string prefixes or a row and column.",
      "checkpoint": [
        "What information disappears if you keep only one LCS row?",
        "Earlier cells are overwritten. The final row still gives the optimal length, but direct reconstruction by following the full table's choices is unavailable."
      ]
    },
    {
      "title": "Bit manipulation",
      "slug": "single-number",
      "number": 136,
      "problem": "Single Number",
      "difficulty": "Easy",
      "category": "Core pattern",
      "examples": [
        [
          "xor_prefix([5, 3, 5])",
          "[5, 6, 3]"
        ],
        [
          "xor_prefix([])",
          "[]"
        ]
      ],
      "frames": [
        [
          "Values are 5, 3, 5. The accumulator starts at binary 000.",
          [
            [
              "Values",
              "5 3 5"
            ],
            [
              "Accumulator",
              "000"
            ]
          ]
        ],
        [
          "XOR 000 with 101, the binary form of 5.",
          [
            [
              "Values",
              "*5 3 5"
            ],
            [
              "Accumulator",
              "+101"
            ]
          ]
        ],
        [
          "XOR 101 with 011, the binary form of 3. The result is 110.",
          [
            [
              "Values",
              "5 *3 5"
            ],
            [
              "Accumulator",
              "+110"
            ]
          ]
        ],
        [
          "XOR 110 with 101. The two 5s cancel, leaving 011, which is 3.",
          [
            [
              "Values",
              "5 3 *5"
            ],
            [
              "Accumulator",
              "+011"
            ],
            [
              "Answer",
              "+3"
            ]
          ]
        ]
      ],
      "idea": "XOR compares bits: equal bits produce 0 and different bits produce 1. It is associative and commutative. Since x XOR x = 0 and x XOR 0 = x, every duplicated value cancels.",
      "pitfall": "^ is XOR in Python. Exponentiation uses **. XOR gives the XOR of all odd-frequency values, so the single-odd-value guarantee matters.",
      "warmup": "Compute the XOR of an integer list from left to right. Start at zero and return the accumulator after every element.",
      "warm": "def xor_prefix(values):\n    out, value = [], 0\n    for item in values:\n        value ^= item\n        out.append(value)\n    return out",
      "lc": "Find the single value appearing once when every other value appears exactly twice. Use linear time and constant extra space.",
      "hint": "Rearrange the XOR expression mentally so that duplicate values sit next to each other.",
      "why": "Reordering does not affect XOR. Each duplicated pair becomes zero, leaving the single value combined with zeros.",
      "solution": "class Solution:\n    def singleNumber(self, nums):\n        result = 0\n        for value in nums:\n            result ^= value\n        return result",
      "steps": [
        "Start an accumulator at zero.",
        "XOR each number into the accumulator using Python's ^ operator.",
        "Return the remainder. The approach relies on the problem's occurrence counts."
      ],
      "cost": [
        [
          "Count values with a dictionary",
          "O(n) expected",
          "O(n) extra",
          "Works with many different count conditions."
        ],
        [
          "Fold values with XOR",
          "O(n) fixed-word",
          "O(1) extra",
          "For arbitrary precision integers, account for their bit length. LeetCode values are bounded."
        ]
      ],
      "recognize": "Use XOR when duplicate pairs should cancel. Use shifts and masks when reading or setting individual bits.",
      "checkpoint": [
        "What is the XOR of [2, 2, 7, 9]? Why does it not identify a single original value?",
        "The two 2s cancel, leaving 7 XOR 9 = 14. There are two odd-frequency values, so the single-value guarantee does not hold."
      ]
    },
    {
      "title": "Fenwick trees and range queries",
      "slug": "range-sum-query-mutable",
      "number": 307,
      "problem": "Range Sum Query – Mutable",
      "difficulty": "Medium",
      "category": "Stretch",
      "examples": [
        [
          "bucket_endpoints(13)",
          "[13, 12, 8]"
        ],
        [
          "bucket_endpoints(8)",
          "[8]"
        ]
      ],
      "frames": [
        [
          "For values [1, 3, 5, 2], buckets 1–4 hold sums 1, 4, 5, 11.",
          [
            [
              "Values",
              "1 3 5 2"
            ],
            [
              "Bucket sums (1-based)",
              "1 4 5 11"
            ]
          ]
        ],
        [
          "A prefix of three uses buckets 3 and 2, covering [3] and [1,2] in one-based positions.",
          [
            [
              "Values",
              "1 3 5 2"
            ],
            [
              "Bucket sums (1-based)",
              "1 *4 *5 11"
            ],
            [
              "Prefix",
              "+9"
            ]
          ]
        ],
        [
          "Replace index 1 with 2. Add delta −1 at one-based bucket 2, then at 4.",
          [
            [
              "Values",
              "1 *2 5 2"
            ],
            [
              "Bucket sums (1-based)",
              "1 +3 5 +10"
            ]
          ]
        ],
        [
          "Range [1,2] equals prefix(3) − prefix(1) = (5 + 3) − 1 = 7.",
          [
            [
              "Values",
              "1 +2 +5 2"
            ],
            [
              "Bucket sums (1-based)",
              "*1 *3 *5 10"
            ],
            [
              "Answer",
              "+7"
            ]
          ]
        ]
      ],
      "idea": "Prefix sums answer static range sums quickly but a point update can change every later prefix. A Fenwick tree stores partial sums in one-based buckets. The least significant set bit lowbit(i) = i & −i gives the width of the bucket ending at i.",
      "pitfall": "Convert zero-based input indices to one-based bucket indices. An update replaces a value, so send its delta, new minus old. Never start the add loop at index zero.",
      "warmup": "Given a positive one-based end index i, return the sequence of bucket endpoints visited by a Fenwick prefix query. Assume i ≥ 1.",
      "warm": "def bucket_endpoints(i):\n    result = []\n    while i > 0:\n        result.append(i)\n        i -= i & -i\n    return result",
      "lc": "Implement point replacement and inclusive range-sum queries over a mutable integer array.",
      "hint": "Keep the original values to compute update deltas. Subtract two prefix sums for a range.",
      "why": "For a prefix ending at i, the bucket ending at i covers the last lowbit(i) values. Subtracting that width gives the remaining disjoint prefix. An update adds its delta to exactly the buckets containing its point.",
      "solution": "class NumArray:\n    def __init__(self, nums):\n        self.values = list(nums)\n        self.tree = [0] * (len(nums) + 1)\n        for index, value in enumerate(nums, 1):\n            self._add(index, value)\n\n    def _add(self, index, delta):\n        while index < len(self.tree):\n            self.tree[index] += delta\n            index += index & -index\n\n    def _prefix(self, end):\n        total = 0\n        while end > 0:\n            total += self.tree[end]\n            end -= end & -end\n        return total\n\n    def update(self, index, val):\n        delta = val - self.values[index]\n        self.values[index] = val\n        self._add(index + 1, delta)\n\n    def sumRange(self, left, right):\n        return self._prefix(right + 1) - self._prefix(left)",
      "steps": [
        "Add a delta to a point by visiting its containing buckets: i += lowbit(i).",
        "Read a prefix by collecting disjoint buckets: i -= lowbit(i).",
        "For a closed zero-based range [left, right], subtract prefix(left) from prefix(right + 1), where the argument is the number of original elements included."
      ],
      "cost": [
        [
          "Update the array and sum each query",
          "O(1) update, O(n) query",
          "O(n) storage",
          "Good if there are very few queries."
        ],
        [
          "Store Fenwick buckets",
          "O(log n) per update or query",
          "O(n) storage",
          "This simple build calls add n times for O(n log n) preprocessing."
        ]
      ],
      "recognize": "Use Fenwick trees when point updates and prefix or range sums are both frequent. Segment trees can support a wider range of aggregate operations.",
      "checkpoint": [
        "Which one-based buckets change when replacing zero-based index 2 in an array of length 8?",
        "Start at bucket 3, then add lowbit(3)=1 to reach 4, and lowbit(4)=4 to reach 8. All three buckets receive the same delta."
      ]
    }
  ],
  "weeks": [
    [
      "Foundations",
      "Trace an array scan and explain how loop shape affects cost.",
      "How many pair comparisons does a duplicate check make on [5, 1, 8, 3, 9] if it scans every pair? What changes with a set?",
      "10 pair comparisons. A set does five membership checks, using up to five stored values. Expected time drops from O(n²) to O(n) and extra memory rises from O(1) to O(n)."
    ],
    [
      "Lookup and counting",
      "Use dictionaries to answer membership, complement, and frequency questions.",
      "For [3, 4, 3] and target 6, write the Two Sum map before reading each item. Then decide whether “abb” and “bab” are anagrams.",
      "Before each item: {}, {3: 0}, then {3: 0, 4: 1}. Return [0, 2]. The strings are anagrams because both counts are a=1 and b=2."
    ],
    [
      "Moving boundaries",
      "Use order or a contiguous range to avoid repeating work.",
      "Choose a technique for each task: find a pair totaling 12 in [1, 3, 6, 9], then find the largest sum of two consecutive entries in [1, 3, 6, 9].",
      "Two pointers discard 1 after checking 1+9 and then find 3+9. A fixed window checks sums 4, 9, and 15, so the maximum is 15."
    ],
    [
      "Prefix totals and sorting",
      "Precompute reusable totals and merge sorted runs.",
      "For [2, −1, 3, 1], give the inclusive sum of indices 1–3. Then merge [−1, 2] and [1, 3].",
      "Prefixes are [0, 2, 1, 4, 5]. The requested sum is 5−2=3. The sorted merge is [−1, 1, 2, 3]."
    ],
    [
      "Halving the search",
      "Identify the invariant behind searching sorted indices and feasible answers.",
      "Find the first index ≥ 4 in [1, 4, 4, 8]. Then find the smallest speed that finishes piles [5, 4] in 4 hours.",
      "Lower bound returns index 1. Speed 2 takes 3+2=5 hours and speed 3 takes 2+2=4 hours. The minimum feasible speed is 3."
    ],
    [
      "Stack discipline",
      "Distinguish nesting checks from next-greater queries.",
      "Trace the first error in “([)]”. Then give the next strictly greater values for [2, 2, 3, 1].",
      "On reading the first closer “)”, the top is “[”, so the string is invalid. Next-greater values are [3, 3, None, None]. Equal 2s stay pending until 3."
    ],
    [
      "Queues and links",
      "Practice FIFO order and safe reference updates.",
      "Process ticket events A, B, serve, C, serve. Then name prev and curr after reversing the first two links of A → B → C.",
      "Tickets A and B are served, leaving C. prev points at B in B → A → None and curr points at C."
    ],
    [
      "Pointer and search state",
      "Trace a meeting of two pointers and undo a choice during recursion.",
      "Find the second middle of A → B → C → D. List the DFS subset output order for [4, 8] using increasing indices.",
      "The second middle is C. The traversal records [], [4], [4, 8], [8]. Each recursive choice is popped before exploring its sibling."
    ],
    [
      "Tree traversal",
      "Choose depth-first or breadth-first processing based on the required output.",
      "A has children B and C, and B has left child D. Give preorder DFS, level-order BFS, and maximum depth in nodes.",
      "Preorder is A, B, D, C. Levels are [A], [B, C], [D]. Maximum depth is 3 nodes along A → B → D."
    ],
    [
      "Ordered trees and heaps",
      "Distinguish a global ordering invariant from a root-priority guarantee.",
      "Is a BST valid if root 8 has right child 12 and 12 has left child 7? What values does a top-two min-heap retain after [5, 2, 9, 7]?",
      "No. The whole right subtree must exceed 8. The heap retains 7 and 9, and its root 7 is the second largest."
    ],
    [
      "Prefixes and overlaps",
      "Reuse shared prefixes and merge intervals with an explicit boundary rule.",
      "A trie stores “car” and “cat”. Give search('ca') and startsWith('ca'). Merge closed intervals [1, 3], [2, 2], and [3, 4].",
      "Exact search is False because ca has no terminal flag. Prefix search is True. The merged closed interval is [1, 4]."
    ],
    [
      "Reachability",
      "Explain reachability using an array frontier and a grid component.",
      "Can [1, 0, 2] reach its end? How many islands are in rows “10” and “01” with four-directional moves?",
      "No. Index 1 is reachable but cannot extend the frontier past 1. The grid has two islands because diagonal contact does not connect land."
    ],
    [
      "Dependencies and connectivity",
      "Use indegrees for directed dependencies and roots for undirected groups.",
      "Order courses with edges A→C and B→C. Then process undirected edges A–B, B–C, A–C and identify the redundant edge.",
      "A and B can appear in either order before C. A–C is redundant because the first two edges already connect its endpoints."
    ],
    [
      "Weighted graphs",
      "Separate the goals of shortest-path and spanning-tree algorithms.",
      "In an undirected triangle with A–B cost 2, B–C cost 2 and A–C cost 3, give the shortest A-to-C path and the minimum spanning tree.",
      "The shortest route uses A–C at cost 3. The MST uses A–B and B–C at total cost 4. They optimize different objectives."
    ],
    [
      "Dynamic programming",
      "Write states, base cases, and dependencies before coding.",
      "For houses [3, 2, 5, 10], compute the best total for every prefix. Then find the LCS length of “abc” and “bac”.",
      "The totals are [0, 3, 3, 8, 13]. The LCS length is 2, for example “ac” or “bc”. A subsequence can skip positions."
    ],
    [
      "Bits and mutable sums",
      "Review cancellation and lowbit jumps, then revisit your weakest pattern.",
      "Compute 9 XOR 6 XOR 9. With a Fenwick tree for [3, 1, 4, 2], replace index 1 with 6 and find the sum of indices 1–3.",
      "The XOR equals 6. The replacement delta is +5 and updates buckets 2 and 4. The inclusive sum is 6+4+2=12."
    ]
  ]
};
