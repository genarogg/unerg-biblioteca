import { Search as Lupita } from "lucide-react"
import "./css/search.css"

import { useTableState } from "../../../context/TableContext"

interface SearchProps {

}

const Search: React.FC<SearchProps> = () => {

    const { searchTerm, handleSearch } =
        useTableState()

    return (
        <div className="table-search-container">
            <Lupita className="table-search-icon" size={20} />
            <input
                type="text"
                placeholder="Buscar elementos..."
                className="table-search-input"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}

export default Search;
