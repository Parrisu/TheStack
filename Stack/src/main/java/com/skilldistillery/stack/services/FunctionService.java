package com.skilldistillery.stack.services;

import java.util.List;
import java.util.Set;

import com.skilldistillery.stack.entities.Function;
import com.skilldistillery.stack.entities.Technology;

public interface FunctionService {
	Set<Function> searchFunctions(String searchQuery, String cityName, String stateAbbr, String username,
			Set<Technology> stack);

	Function findById(int functionId);

	List<Function> findByNode(int id);

}
