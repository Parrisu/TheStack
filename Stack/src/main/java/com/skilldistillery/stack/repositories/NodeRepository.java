package com.skilldistillery.stack.repositories;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.skilldistillery.stack.entities.Node;
import com.skilldistillery.stack.entities.Technology;

public interface NodeRepository extends JpaRepository<Node, Integer> {
	public List<Node> findByNameContaining(String name);

	@Query("""
			SELECT
			  DISTINCT node
			FROM
			  Node node
			WHERE
			  node.enabled = true
			  AND (
			    :searchQuery IS NULL
			    OR node.name LIKE %:searchQuery%
			  )
			  AND (
			    :city IS NULL
			    OR node.city LIKE %:city%
			  )
			  AND (
			    :stateAbbr IS NULL
			    OR node.stateAbbreviation LIKE %:stateAbbr%
			  )
			""")
	Set<Node> searchNodes(@Param("searchQuery") String searchQuery, @Param("city") String city,
			@Param("stateAbbr") String stateAbbr);
}
