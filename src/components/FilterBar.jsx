export default function FilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar row g-2">
      {filters.map((filter) => (
        <div key={filter.key} className="col-md-3 col-12">
          <select
            className="form-select"
            value={filter.value}
            onChange={(event) => onChange(filter.key, event.target.value)}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
