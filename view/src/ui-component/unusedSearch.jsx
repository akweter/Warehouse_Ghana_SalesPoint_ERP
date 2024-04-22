const {
    OutlinedInput,
    InputAdornment,

} = require("@mui/material");
const { IconSearch } = require("@tabler/icons");
const { default: theme } = require("themes");

<OutlinedInput
    sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
    id="input-search-profile"
    value={0}
    // onChange={(e) => setValue(e.target.value)}
    placeholder="Search profile options"
    startAdornment={
        <InputAdornment position="start">
            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
        </InputAdornment>
    }
    aria-describedby="search-helper-text"
    inputProps={{
        'aria-label': 'weight'
    }}
/>